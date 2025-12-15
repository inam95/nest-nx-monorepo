import { okResponseSchema, signInDataSchema, signInRequestSchema } from "@nest-nx-monorepo/shared-types";
import { createZodDto } from "nestjs-zod";

export class SignInDto extends createZodDto(signInRequestSchema) {}

export const signInResponseSchema = okResponseSchema(signInDataSchema);

export class SignInResponseDto extends createZodDto(signInResponseSchema) {}
