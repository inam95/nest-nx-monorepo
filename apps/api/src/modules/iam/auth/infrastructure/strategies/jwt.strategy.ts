import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { FastifyRequest } from "fastify";
import { ExtractJwt, Strategy } from "passport-jwt";

import { type IUserRepository, USER_REPOSITORY } from "@/modules/iam/users/domain/ports/user.repository.interface";
import { AppConfigService } from "@/shared/config";

import { AccessTokenPayload } from "../services/token.service";

const cookieExtractor = (request: FastifyRequest): string | null => {
  return request?.cookies?.access_token || null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly config: AppConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: config.jwt.jwtSecret
    });
  }

  async validate(payload: AccessTokenPayload) {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException({
        code: "USER_NOT_FOUND",
        message: "User no longer exists",
        type: "AUTHENTICATION"
      });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException({
        code: "TOKEN_REVOKED",
        message: "Token has been revoked",
        type: "AUTHENTICATION"
      });
    }

    return user;
  }
}
