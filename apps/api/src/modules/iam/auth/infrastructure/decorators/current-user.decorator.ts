import type { User } from "@modules/iam/users/domain/entities/user.entity";
import type { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";
import type { FastifyRequest } from "fastify";

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): User => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>();
  return request.user;
});
