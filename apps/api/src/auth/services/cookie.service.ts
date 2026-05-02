import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { TokenPair } from '../interfaces/token-pair.interface';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  setAuthCookies(res: Response, tokens: TokenPair): void {
    const cookieOptions = this.getBaseCookieOptions();

    res.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
      ...cookieOptions,
      maxAge: this.getDurationInMilliseconds(
        this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m',
      ),
    });

    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      ...cookieOptions,
      maxAge: this.getDurationInMilliseconds(
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d',
      ),
    });
  }

  clearAuthCookies(res: Response): void {
    const cookieOptions = this.getBaseCookieOptions();

    res.clearCookie(ACCESS_TOKEN_COOKIE, cookieOptions);
    res.clearCookie(REFRESH_TOKEN_COOKIE, cookieOptions);
  }

  private getBaseCookieOptions() {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    const cookieDomain = this.configService
      .get<string>('COOKIE_DOMAIN')
      ?.trim();

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    };
  }

  private getDurationInMilliseconds(value: string): number {
    return this.getDurationInSeconds(value) * 1000;
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
