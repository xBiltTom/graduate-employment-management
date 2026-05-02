import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookieService } from './services/cookie.service';
import { InMemoryTokenStoreService } from './services/in-memory-token-store.service';
import { TokenStoreService } from './services/token-store.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = getDurationInSeconds(
          configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m',
        );

        return {
          secret:
            configService.get<string>('JWT_ACCESS_SECRET') ??
            'dev-access-secret-change-me',
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CookieService,
    JwtStrategy,
    InMemoryTokenStoreService,
    {
      provide: TokenStoreService,
      useExisting: InMemoryTokenStoreService,
    },
  ],
  exports: [AuthService, CookieService, TokenStoreService],
})
export class AuthModule {}

function getDurationInSeconds(value: string): number {
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
