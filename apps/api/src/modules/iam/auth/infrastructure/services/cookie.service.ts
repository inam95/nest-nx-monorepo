import { Injectable } from "@nestjs/common";
import type { FastifyReply } from "fastify";

import { AppConfigService } from "@/shared/config";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

@Injectable()
export class CookieService {
  constructor(private readonly config: AppConfigService) {}

  setAuthCookies(reply: FastifyReply, accessToken: string, refreshToken: string, refreshTokenExpiresAt: Date): void {
    const cookieOptions = {
      httpOnly: true,
      secure: this.config.cookie.secure,
      sameSite: this.config.cookie.sameSite,
      domain: this.config.cookie.domain || undefined,
      path: "/"
    };
    reply.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60
    });
    reply.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...cookieOptions,
      expires: refreshTokenExpiresAt
    });
  }

  clearAuthCookies(reply: FastifyReply): void {
    const cookieOptions = {
      httpOnly: true,
      secure: this.config.cookie.secure,
      sameSite: this.config.cookie.sameSite,
      domain: this.config.cookie.domain || undefined,
      path: "/"
    };

    reply.clearCookie(ACCESS_TOKEN_COOKIE, cookieOptions);
    reply.clearCookie(REFRESH_TOKEN_COOKIE, cookieOptions);
  }
}
