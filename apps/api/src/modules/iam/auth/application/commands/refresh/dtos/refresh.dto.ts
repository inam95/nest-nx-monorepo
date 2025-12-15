import { okResponseSchema, refreshDataSchema } from "@nest-nx-monorepo/shared-types";
import { createZodDto } from "nestjs-zod";

export const refreshResponseSchema = okResponseSchema(refreshDataSchema);
export class RefreshResponseDto extends createZodDto(refreshResponseSchema) {}
