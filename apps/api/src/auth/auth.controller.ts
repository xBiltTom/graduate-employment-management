import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { CookieService } from './services/cookie.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);
    this.cookieService.setAuthCookies(res, result.tokens);

    return this.buildAuthResponse(result.user, result.tokens);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    this.cookieService.setAuthCookies(res, result.tokens);

    return this.buildAuthResponse(result.user, result.tokens);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = this.authService.getRefreshTokenFromSources(req, dto);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token requerido');
    }

    const result = await this.authService.refresh(refreshToken);
    this.cookieService.setAuthCookies(res, result.tokens);

    return this.buildAuthResponse(result.user, result.tokens);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.id);
    this.cookieService.clearAuthCookies(res);

    return {
      message: 'Sesión cerrada correctamente',
    };
  }

  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  private buildAuthResponse(
    user: AuthenticatedUser,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    return {
      user,
      ...(isProduction ? {} : { tokens }),
    };
  }
}
