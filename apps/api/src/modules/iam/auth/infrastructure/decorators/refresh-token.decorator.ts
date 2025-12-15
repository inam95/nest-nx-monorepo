import type { ExecutionContext } from "@nestjs/common";
import { createParamDecorator, UnauthorizedException } from "@nestjs/common";
import type { FastifyRequest } from "fastify";

export const RefreshTokenFromCookie = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>();
  const refreshToken = (request.cookies as Record<string, string>)?.refresh_token;

  if (!refreshToken) {
    throw new UnauthorizedException({
      code: "REFRESH_TOKEN_MISSING",
      message: "Refresh token not found in cookies"
    });
  }

  return refreshToken;
});
