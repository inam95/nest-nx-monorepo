import {
  meDataSchema,
  noContent,
  noContentResponseSchema,
  ok,
  okResponseSchema,
  type User
} from "@nest-nx-monorepo/shared-types";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import type { FastifyReply, FastifyRequest } from "fastify";
import { createZodDto, ZodResponse } from "nestjs-zod";

import { RefreshResponseDto } from "../application/commands/refresh";
import { RefreshCommand, RefreshResult } from "../application/commands/refresh";
import { SignInCommand, SignInResult } from "../application/commands/sign-in";
import { SignInDto, SignInResponseDto } from "../application/commands/sign-in";
import { SignOutCommand } from "../application/commands/sign-out";
import { SignUpCommand, SignUpDto, SignUpResponseDto } from "../application/commands/sign-up";
import { CurrentUser } from "../infrastructure/decorators/current-user.decorator";
import { RefreshTokenFromCookie } from "../infrastructure/decorators/refresh-token.decorator";
import { JwtAuthGuard } from "../infrastructure/guards/jwt-auth.guard";
import { LocalAuthGuard } from "../infrastructure/guards/local-auth.guard";
import { CookieService } from "../infrastructure/services/cookie.service";

class MeResponseDto extends createZodDto(okResponseSchema(meDataSchema)) {}
class SignOutResponseDto extends createZodDto(noContentResponseSchema()) {}

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly cookieService: CookieService
  ) {}

  @Post("signup")
  @ApiOperation({ summary: "Register a new user" })
  @ZodResponse({ status: 201, type: SignUpResponseDto, description: "User registered successfully" })
  async signUp(@Body() dto: SignUpDto) {
    const { id } = await this.commandBus.execute<SignUpCommand, { id: string }>(
      new SignUpCommand(dto.email, dto.password, dto.firstName, dto.lastName)
    );

    return ok({ id });
  }

  @Post("signin")
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: "Sign in with email and password" })
  @ZodResponse({ status: 200, type: SignInResponseDto, description: "User signed in successfully" })
  async signIn(
    @Body() _dto: SignInDto,
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply
  ) {
    const user = request.user;

    // Execute sign-in command (generates tokens, stores refresh token)
    const result = await this.commandBus.execute<SignInCommand, SignInResult>(
      new SignInCommand(user, (request.headers["user-agent"] as string) || null, request.ip || null)
    );

    // Set httpOnly cookies
    this.cookieService.setAuthCookies(
      reply,
      result.tokens.accessToken,
      result.tokens.refreshToken,
      result.refreshTokenExpiresAt
    );

    // Return user data (tokens are in cookies, not response body)
    return ok({
      id: result.user.id,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      email: result.user.email,
      role: result.user.role,
      isEmailVerified: result.user.isEmailVerified
    });
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get current authenticated user" })
  @ApiBearerAuth("access-token")
  @ZodResponse({ status: 200, type: MeResponseDto, description: "Current user data" })
  @ApiUnauthorizedResponse({ description: "Invalid or expired token" })
  me(@CurrentUser() user: User) {
    return ok({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    });
  }

  @Post("refresh")
  @ApiOperation({ summary: "Refresh access token using refresh token" })
  @ZodResponse({ status: 200, type: RefreshResponseDto, description: "Access token refreshed successfully" })
  @ApiUnauthorizedResponse({ description: "Invalid or expired refresh token" })
  async refresh(
    @RefreshTokenFromCookie() refreshToken: string,
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply
  ) {
    const result = await this.commandBus.execute<RefreshCommand, RefreshResult>(
      new RefreshCommand(refreshToken, (request.headers["user-agent"] as string) || null, request.ip || null)
    );

    this.cookieService.setAuthCookies(
      reply,
      result.tokens.accessToken,
      result.tokens.refreshToken,
      result.refreshTokenExpiresAt
    );

    return ok({
      id: result.user.id,
      email: result.user.email,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      role: result.user.role,
      isEmailVerified: result.user.isEmailVerified
    });
  }

  @Post("signout")
  @ApiOperation({ summary: "Sign out and revoke refresh token" })
  @ZodResponse({ status: 200, type: SignOutResponseDto, description: "User signed out successfully" })
  async signOut(@Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
    const refreshToken = (request.cookies as Record<string, string>)?.refresh_token ?? null;

    await this.commandBus.execute(new SignOutCommand(refreshToken));

    this.cookieService.clearAuthCookies(reply);

    return noContent();
  }
}
