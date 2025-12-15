import type { User } from "@/modules/iam/users/domain/entities/user.entity";

declare module "fastify" {
  interface FastifyRequest {
    user: User;
    cookies: {
      access_token: string;
      refresh_token: string;
      [key: string]: string | undefined;
    };
  }
}
