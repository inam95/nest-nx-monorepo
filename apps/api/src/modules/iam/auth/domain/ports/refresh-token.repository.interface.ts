import type { RefreshToken } from "../entities/refresh-token.entity";

export interface IRefreshTokenRepository {
  create(token: Partial<RefreshToken>): RefreshToken;
  findByUserId(userId: string): Promise<RefreshToken[]>;
  findByHashedToken(hashedToken: string): Promise<RefreshToken | null>;
  delete(id: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<number>;
  updateLastUsed(id: string): Promise<void>;
  save(token: RefreshToken): Promise<RefreshToken>;
  findByHashedTokenWithUser(hashedToken: string): Promise<RefreshToken | null>;
}

export const REFRESH_TOKEN_REPOSITORY = Symbol("REFRESH_TOKEN_REPOSITORY");
