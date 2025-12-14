import { ok } from "@nest-nx-monorepo/shared-types";
import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";

import { SignUpCommand, SignUpDto, SignUpResponseDto } from "../application/commands/sign-up";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("signup")
  @ApiOperation({ summary: "Register a new user" })
  @ZodResponse({ status: 201, type: SignUpResponseDto, description: "User registered successfully" })
  async signUp(@Body() dto: SignUpDto) {
    const { id } = await this.commandBus.execute<SignUpCommand, { id: string }>(
      new SignUpCommand(dto.email, dto.password, dto.firstName, dto.lastName)
    );

    return ok({ id });
  }
}
