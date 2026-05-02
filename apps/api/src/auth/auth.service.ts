import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  EstadoUsuario,
  EstadoValidacionEmpresa,
  ProveedorAuth,
  RolUsuario,
} from '@graduate-employment-management/database';
import * as argon2 from 'argon2';
import { Request } from 'express';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { TokenPair } from './interfaces/token-pair.interface';
import { TokenStoreService } from './services/token-store.service';

interface AuthResult {
  user: AuthenticatedUser;
  tokens: TokenPair;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenStoreService: TokenStoreService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    if (dto.rol === RolUsuario.ADMINISTRADOR) {
      throw new ForbiddenException(
        'No se permite el registro público de administradores',
      );
    }

    await this.ensureEmailIsAvailable(dto.email);
    const passwordHash = await argon2.hash(dto.password);

    if (dto.rol === RolUsuario.EGRESADO) {
      await this.ensureDniIsAvailable(dto.dni ?? '');

      const user = await this.prisma.$transaction((tx) =>
        tx.usuario.create({
          data: {
            email: dto.email,
            passwordHash,
            rol: RolUsuario.EGRESADO,
            estado: EstadoUsuario.ACTIVO,
            proveedorAuth: ProveedorAuth.CREDENCIALES,
            egresado: {
              create: {
                nombres: dto.nombres ?? '',
                apellidos: dto.apellidos ?? '',
                dni: dto.dni ?? '',
              },
            },
          },
        }),
      );

      return this.buildAuthResult({
        id: user.id,
        email: user.email,
        rol: user.rol,
      });
    }

    if (dto.rol === RolUsuario.EMPRESA) {
      await this.ensureRucIsAvailable(dto.ruc ?? '');

      const user = await this.prisma.$transaction((tx) =>
        tx.usuario.create({
          data: {
            email: dto.email,
            passwordHash,
            rol: RolUsuario.EMPRESA,
            estado: EstadoUsuario.PENDIENTE,
            proveedorAuth: ProveedorAuth.CREDENCIALES,
            empresa: {
              create: {
                nombreComercial: dto.nombreComercial ?? '',
                razonSocial: dto.razonSocial ?? '',
                ruc: dto.ruc ?? '',
                estadoValidacion: EstadoValidacionEmpresa.PENDIENTE,
              },
            },
          },
        }),
      );

      return this.buildAuthResult({
        id: user.id,
        email: user.email,
        rol: user.rol,
      });
    }

    throw new ForbiddenException('Rol no permitido para registro público');
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const invalidCredentialsMessage = 'Credenciales inválidas';
    const user = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException(invalidCredentialsMessage);
    }

    if (
      user.proveedorAuth !== ProveedorAuth.CREDENCIALES ||
      !user.passwordHash
    ) {
      throw new UnauthorizedException(invalidCredentialsMessage);
    }

    const passwordMatches = await argon2.verify(
      user.passwordHash,
      dto.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(invalidCredentialsMessage);
    }

    this.assertUserCanAuthenticate(user);

    await this.prisma.usuario.update({
      where: { id: user.id },
      data: { ultimoLoginEn: new Date() },
    });

    return this.buildAuthResult({
      id: user.id,
      email: user.email,
      rol: user.rol,
    });
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ??
          'dev-refresh-secret-change-me',
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const isValid = await this.tokenStoreService.verifyRefreshToken(
      payload.sub,
      refreshToken,
    );

    if (!isValid) {
      await this.tokenStoreService.deleteRefreshToken(payload.sub);
      throw new UnauthorizedException('Refresh token inválido');
    }

    const user = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      await this.tokenStoreService.deleteRefreshToken(payload.sub);
      throw new UnauthorizedException('Refresh token inválido');
    }

    this.assertUserCanAuthenticate(user);

    return this.buildAuthResult({
      id: user.id,
      email: user.email,
      rol: user.rol,
    });
  }

  async logout(userId: string): Promise<void> {
    await this.tokenStoreService.deleteRefreshToken(userId);
  }

  async validateJwtPayload(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Autenticación requerida');
    }

    this.assertUserCanAuthenticate(user);

    if (user.email !== payload.email || user.rol !== payload.rol) {
      throw new UnauthorizedException('Autenticación requerida');
    }

    return {
      id: user.id,
      email: user.email,
      rol: user.rol,
    };
  }

  async getUserFromRequest(req: Request): Promise<AuthenticatedUser | null> {
    const token = this.extractAccessTokenFromRequest(req);

    if (!token) {
      return null;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret:
          this.configService.get<string>('JWT_ACCESS_SECRET') ??
          'dev-access-secret-change-me',
      });

      return await this.validateJwtPayload(payload);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.debug(
          `No se pudo resolver el usuario autenticado: ${error.message}`,
        );
      }

      return null;
    }
  }

  getRefreshTokenFromSources(
    req: Request,
    dto?: RefreshTokenDto,
  ): string | null {
    const cookieToken =
      typeof req.cookies?.refresh_token === 'string'
        ? req.cookies.refresh_token
        : null;

    if (cookieToken) {
      return cookieToken;
    }

    const bodyToken = dto?.refreshToken?.trim();
    return bodyToken && bodyToken.length > 0 ? bodyToken : null;
  }

  private async buildAuthResult(user: AuthenticatedUser): Promise<AuthResult> {
    const tokens = await this.generateTokenPair(user);
    await this.tokenStoreService.saveRefreshToken(
      user.id,
      tokens.refreshToken,
      this.getDurationInSeconds(
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d',
      ),
    );

    return {
      user,
      tokens,
    };
  }

  private async generateTokenPair(user: AuthenticatedUser): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret:
          this.configService.get<string>('JWT_ACCESS_SECRET') ??
          'dev-access-secret-change-me',
        expiresIn: this.getDurationInSeconds(
          this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m',
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ??
          'dev-refresh-secret-change-me',
        expiresIn: this.getDurationInSeconds(
          this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d',
        ),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private extractAccessTokenFromRequest(req: Request): string | null {
    const cookieToken =
      typeof req.cookies?.access_token === 'string'
        ? req.cookies.access_token
        : null;

    if (cookieToken) {
      return cookieToken;
    }

    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      return null;
    }

    return authorizationHeader.slice('Bearer '.length).trim() || null;
  }

  private assertUserCanAuthenticate(user: {
    estado: EstadoUsuario;
    proveedorAuth: ProveedorAuth;
    passwordHash: string | null;
  }): void {
    if (user.estado === EstadoUsuario.SUSPENDIDO) {
      throw new ForbiddenException('Usuario suspendido');
    }

    if (
      user.proveedorAuth === ProveedorAuth.CREDENCIALES &&
      !user.passwordHash
    ) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  private async ensureEmailIsAvailable(email: string): Promise<void> {
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }
  }

  private async ensureDniIsAvailable(dni: string): Promise<void> {
    const existingGraduate = await this.prisma.egresado.findUnique({
      where: { dni },
      select: { id: true },
    });

    if (existingGraduate) {
      throw new ConflictException('El DNI ya está registrado');
    }
  }

  private async ensureRucIsAvailable(ruc: string): Promise<void> {
    const existingCompany = await this.prisma.empresa.findUnique({
      where: { ruc },
      select: { id: true },
    });

    if (existingCompany) {
      throw new ConflictException('El RUC ya está registrado');
    }
  }

  private getDurationInSeconds(value: string): number {
    const normalized = value.trim();
    const match = normalized.match(/^(\d+)([smhd])$/i);

    if (!match) {
      const numeric = Number(normalized);
      return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
    }

    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 's':
        return amount;
      case 'm':
        return amount * 60;
      case 'h':
        return amount * 60 * 60;
      case 'd':
        return amount * 60 * 60 * 24;
      default:
        return 0;
    }
  }
}
