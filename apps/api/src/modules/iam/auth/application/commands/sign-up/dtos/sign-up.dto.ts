import { okResponseSchema, signUpDataSchema, signUpRequestSchema } from "@nest-nx-monorepo/shared-types";
import { createZodDto } from "nestjs-zod";

export class SignUpDto extends createZodDto(signUpRequestSchema) {}

export const signUpResponseSchema = okResponseSchema(signUpDataSchema);

export class SignUpResponseDto extends createZodDto(signUpResponseSchema) {}
