import { type UserRole, userRoleSchema } from "@nest-nx-monorepo/shared-types";
import { BaseEntity } from "@shared/database";
import { Column, Entity, Index } from "typeorm";

const BASIC = userRoleSchema.enum.BASIC;
const ADMIN = userRoleSchema.enum.ADMIN;
const SUPER_ADMIN = userRoleSchema.enum.SUPER_ADMIN;

const ROLE_HIERARCHY: Record<UserRole, number> = {
  [BASIC]: 1,
  [ADMIN]: 2,
  [SUPER_ADMIN]: 3
};

@Entity("users")
@Index("idx_users_email", ["email"])
export class User extends BaseEntity {
  @Column({ name: "first_name" })
  declare firstName: string;

  @Column({ name: "last_name" })
  declare lastName: string;

  @Column({ unique: true })
  declare email: string;

  @Column({ select: false })
  declare password: string;

  @Column({ type: "enum", enum: userRoleSchema.enum, enumName: "user_role", default: BASIC })
  declare role: UserRole;

  @Column({ name: "token_version", default: 1, type: "integer" })
  declare tokenVersion: number;

  @Column({ name: "is_email_verified", default: false })
  declare isEmailVerified: boolean;

  static create(props: {
    email: string;
    password: string; // already hashed
    firstName: string;
    lastName: string;
    role?: UserRole;
  }): User {
    const user = new User();
    user.email = props.email.toLowerCase().trim();
    user.password = props.password;
    user.firstName = props.firstName.trim();
    user.lastName = props.lastName.trim();
    user.role = props.role ?? BASIC;
    user.tokenVersion = 1;
    user.isEmailVerified = false;
    return user;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  markEmailVerified(): void {
    this.isEmailVerified = true;
  }

  invalidateAllTokens(): void {
    this.tokenVersion += 1;
  }

  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  hasRoleOrHigher(role: UserRole): boolean {
    return ROLE_HIERARCHY[this.role] >= ROLE_HIERARCHY[role];
  }
}
