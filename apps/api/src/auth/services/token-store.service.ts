export abstract class TokenStoreService {
  abstract saveRefreshToken(
    userId: string,
    refreshToken: string,
    ttlSeconds: number,
  ): Promise<void>;

  abstract verifyRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean>;

  abstract deleteRefreshToken(userId: string): Promise<void>;
}
