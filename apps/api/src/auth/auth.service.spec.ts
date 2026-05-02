import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ProveedorAuth,
  RolUsuario,
} from '@graduate-employment-management/database';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';
import { TokenStoreService } from './services/token-store.service';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe('AuthService', () => {
  const prisma = {
    usuario: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    egresado: {
      findUnique: jest.fn(),
    },
    empresa: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const jwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  } as unknown as JwtService;

  const configService = {
    get: jest.fn((key: string) => {
      const values: Record<string, string> = {
        JWT_ACCESS_SECRET: 'access-secret-example',
        JWT_REFRESH_SECRET: 'refresh-secret-example',
        JWT_ACCESS_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };

      return values[key];
    }),
  } as unknown as ConfigService;

  const tokenStoreService = {
    saveRefreshToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
    deleteRefreshToken: jest.fn(),
  } as unknown as TokenStoreService;

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      prisma as never,
      jwtService,
      configService,
      tokenStoreService,
    );
  });

  it('rechaza registro de ADMINISTRADOR', async () => {
    await expect(
      service.register({
        email: 'admin@example.com',
        password: '12345678',
        rol: RolUsuario.ADMINISTRADOR,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rechaza login con credenciales inválidas', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'missing@example.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('no retorna passwordHash y genera tokens en login exitoso', async () => {
    prisma.usuario.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'graduate@example.com',
      rol: RolUsuario.EGRESADO,
      estado: 'ACTIVO',
      proveedorAuth: ProveedorAuth.CREDENCIALES,
      passwordHash: 'stored-hash',
    });
    prisma.usuario.update.mockResolvedValue(undefined);
    (argon2.verify as jest.Mock).mockResolvedValue(true);
    (jwtService.signAsync as jest.Mock)
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');
    (tokenStoreService.saveRefreshToken as jest.Mock).mockResolvedValue(
      undefined,
    );

    const result = await service.login({
      email: 'graduate@example.com',
      password: '12345678',
    });

    expect(result).toEqual({
      user: {
        id: 'user-1',
        email: 'graduate@example.com',
        rol: RolUsuario.EGRESADO,
      },
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
    });
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('refresh rechaza token inválido', async () => {
    (jwtService.verifyAsync as jest.Mock).mockRejectedValue(
      new Error('invalid'),
    );

    await expect(service.refresh('bad-token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
