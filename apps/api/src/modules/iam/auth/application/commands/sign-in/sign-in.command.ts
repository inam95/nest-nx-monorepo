import type { User } from "@/modules/iam/users/domain/entities/user.entity";

export class SignInCommand {
  constructor(
    public readonly user: User,
    public readonly userAgent: string | null,
    public readonly ipAddress: string | null
  ) {}
}
