import { Injectable, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import { TokenStoreService } from './token-store.service';

interface StoredRefreshToken {
  hash: string;
  expiresAt: number;
}

@Injectable()
export class InMemoryTokenStoreService extends TokenStoreService {
  private readonly logger = new Logger(InMemoryTokenStoreService.name);
  private readonly tokens = new Map<string, StoredRefreshToken>();

  constructor() {
    super();
    this.logger.warn(
      'Usando InMemoryTokenStoreService. No es apto para producción y debe reemplazarse por Redis en una fase posterior.',
    );
  }

  async saveRefreshToken(
    userId: string,
    refreshToken: string,
    ttlSeconds: number,
  ): Promise<void> {
    const hash = await argon2.hash(refreshToken);
    const expiresAt = Date.now() + ttlSeconds * 1000;

    this.tokens.set(userId, {
      hash,
      expiresAt,
    });
  }

  async verifyRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const stored = this.tokens.get(userId);

    if (!stored) {
      return false;
    }

    if (stored.expiresAt <= Date.now()) {
      this.tokens.delete(userId);
      return false;
    }

    return argon2.verify(stored.hash, refreshToken);
  }

  deleteRefreshToken(userId: string): Promise<void> {
    this.tokens.delete(userId);
    return Promise.resolve();
  }
}
