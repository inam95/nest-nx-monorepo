import { User } from "@modules/iam/users/domain/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { AppConfigService } from "@shared/config";
import * as crypto from "crypto";

export interface AccessTokenPayload {
  sub: string; // userId
  email: string;
  role: string;
  tokenVersion: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService
  ) {}

  generateAccessToken(user: User): string {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion
    };

    return this.jwtService.sign(payload, {
      secret: this.config.jwt.jwtSecret,
      expiresIn: this.config.jwt.accessExpiresIn
    } as JwtSignOptions);
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return this.jwtService.verify<AccessTokenPayload>(token, {
      secret: this.config.jwt.jwtSecret
    });
  }

  generateRefreshToken(): string {
    // Generate a cryptographically secure random token
    return crypto.randomBytes(32).toString("hex");
  }

  generateTokenPair(user: User): TokenPair {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken()
    };
  }

  getRefreshTokenExpiresAt(): Date {
    const expiresIn = this.config.jwt.refreshExpiresIn;
    const ms = this.parseExpiresIn(expiresIn);
    return new Date(Date.now() + ms);
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid expiresIn format: ${expiresIn}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 1000 * 60,
      h: 1000 * 60 * 60,
      d: 1000 * 60 * 60 * 24
    };

    return value * multipliers[unit];
  }
}
