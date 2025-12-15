import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";

import { RefreshToken } from "../../domain/entities/refresh-token.entity";
import { IRefreshTokenRepository } from "../../domain/ports/refresh-token.repository.interface";

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>
  ) {}

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    return this.refreshTokenRepository.find({ where: { userId } });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({ where: { token } });
  }

  create(token: Partial<RefreshToken>): RefreshToken {
    const newToken = this.refreshTokenRepository.create(token);
    return newToken;
  }

  async save(token: RefreshToken): Promise<RefreshToken> {
    return this.refreshTokenRepository.save(token);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.refreshTokenRepository.softDelete({ userId });
  }

  async deleteExpired(): Promise<number> {
    const { affected } = await this.refreshTokenRepository.softDelete({
      expiresAt: LessThan(new Date())
    });
    return affected ?? 0;
  }

  async updateLastUsed(id: string): Promise<void> {
    await this.refreshTokenRepository.update(id, { lastUsedAt: new Date() });
  }

  async delete(id: string): Promise<void> {
    await this.refreshTokenRepository.softDelete(id);
  }

  async findByTokenWithUser(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: { token },
      relations: ["user"]
    });
  }
}
