import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersModule } from "../users/users.module";
import { SignupHandler } from "./application/commands/sign-up";
import { RefreshToken } from "./domain/entities/refresh-token.entity";
import { REFRESH_TOKEN_REPOSITORY } from "./domain/ports/refresh-token.repository.interface";
import { RefreshTokenRepository } from "./infrastructure/repositories/refresh-token.repository";
import { AuthController } from "./presentation/auth.controller";

const CommandHandlers = [SignupHandler];

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken]), UsersModule],
  controllers: [AuthController],
  providers: [
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenRepository
    },
    ...CommandHandlers
  ],
  exports: [REFRESH_TOKEN_REPOSITORY]
})
export class AuthModule {}
