import { Inject, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import type { User } from "@/modules/iam/users/domain/entities/user.entity";
import { type IUserRepository, USER_REPOSITORY } from "@/modules/iam/users/domain/ports/user.repository.interface";
import { AppConfigService } from "@/shared/config";

import { RefreshToken } from "../../../domain/entities/refresh-token.entity";
import {
  type IRefreshTokenRepository,
  REFRESH_TOKEN_REPOSITORY
} from "../../../domain/ports/refresh-token.repository.interface";
import { TokenService } from "../../../infrastructure/services/token.service";
import { RefreshCommand } from "./refresh.command";

export interface RefreshResult {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  refreshTokenExpiresAt: Date;
}

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand, RefreshResult> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly config: AppConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async execute(command: RefreshCommand): Promise<RefreshResult> {
    const { refreshToken, userAgent, ipAddress } = command;

    const storedToken = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!storedToken) {
      throw new UnauthorizedException({
        code: "REFRESH_TOKEN_NOT_FOUND",
        message: "Refresh token not found or already revoked"
      });
    }

    if (storedToken.isRevoked) {
      throw new UnauthorizedException({
        code: "REFRESH_TOKEN_REVOKED",
        message: "Refresh token has been revoked"
      });
    }

    if (storedToken.isExpired) {
      throw new UnauthorizedException({
        code: "REFRESH_TOKEN_EXPIRED",
        message: "Refresh token has expired"
      });
    }

    const user = await this.userRepository.findById(storedToken.userId);

    if (!user) {
      throw new UnauthorizedException({
        code: "USER_NOT_FOUND",
        message: "User no longer exists"
      });
    }

    storedToken.revoke();
    await this.refreshTokenRepository.save(storedToken);

    const tokens = this.tokenService.generateTokenPair(user);
    const refreshTokenExpiresAt = this.tokenService.getRefreshTokenExpiresAt();

    const newStoredToken = RefreshToken.create({
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt,
      userAgent,
      ipAddress
    });

    await this.refreshTokenRepository.save(newStoredToken);

    return {
      user,
      tokens,
      refreshTokenExpiresAt
    };
  }
}
