import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import {
  type IRefreshTokenRepository,
  REFRESH_TOKEN_REPOSITORY
} from "../../../domain/ports/refresh-token.repository.interface";
import { SignOutCommand } from "./sign-out.command";

@CommandHandler(SignOutCommand)
export class SignOutHandler implements ICommandHandler<SignOutCommand, void> {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async execute(command: SignOutCommand): Promise<void> {
    const { refreshToken } = command;

    if (!refreshToken) {
      // No token to revoke, just clear cookies (handled by controller)
      return;
    }

    const storedToken = await this.refreshTokenRepository.findByToken(refreshToken);

    if (storedToken && !storedToken.isRevoked) {
      storedToken.revoke();
      await this.refreshTokenRepository.save(storedToken);
    }
  }
}
