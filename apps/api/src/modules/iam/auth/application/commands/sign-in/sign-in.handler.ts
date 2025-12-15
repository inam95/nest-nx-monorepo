import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { User } from "@/modules/iam/users/domain/entities/user.entity";

import { RefreshToken } from "../../../domain/entities/refresh-token.entity";
import {
  type IRefreshTokenRepository,
  REFRESH_TOKEN_REPOSITORY
} from "../../../domain/ports/refresh-token.repository.interface";
import { TokenPair, TokenService } from "../../../infrastructure/services/token.service";
import { SignInCommand } from "./sign-in.command";

export interface SignInResult {
  user: User;
  tokens: TokenPair;
  refreshTokenExpiresAt: Date;
}

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand, SignInResult> {
  constructor(
    private readonly tokenService: TokenService,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async execute(command: SignInCommand): Promise<SignInResult> {
    const { user, userAgent, ipAddress } = command;

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
