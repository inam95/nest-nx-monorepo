import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersModule } from "../users/users.module";
import { RefreshHandler } from "./application/commands/refresh";
import { SignInHandler } from "./application/commands/sign-in";
import { SignOutHandler } from "./application/commands/sign-out";
import { SignupHandler } from "./application/commands/sign-up";
import { ValidateCredentialsHandler } from "./application/commands/validate-credentials";
import { RefreshToken } from "./domain/entities/refresh-token.entity";
import { REFRESH_TOKEN_REPOSITORY } from "./domain/ports/refresh-token.repository.interface";
import { RefreshTokenRepository } from "./infrastructure/repositories/refresh-token.repository";
import { CookieService } from "./infrastructure/services/cookie.service";
import { TokenService } from "./infrastructure/services/token.service";
import { JwtStrategy } from "./infrastructure/strategies/jwt.strategy";
import { LocalStrategy } from "./infrastructure/strategies/local.strategy";
import { AuthController } from "./presentation/auth.controller";

const CommandHandlers = [SignupHandler, ValidateCredentialsHandler, SignInHandler, RefreshHandler, SignOutHandler];

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken]), PassportModule, JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenRepository
    },
    ...CommandHandlers,
    LocalStrategy,
    JwtStrategy,
    TokenService,
    CookieService
  ],
  exports: [REFRESH_TOKEN_REPOSITORY, TokenService, CookieService]
})
export class AuthModule {}
