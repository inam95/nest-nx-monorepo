import { BaseEntity } from "@shared/database";
import { Column, Entity, Index } from "typeorm";

export enum UserRole {
  BASIC = "BASIC",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.BASIC]: 1,
  [UserRole.ADMIN]: 2,
  [UserRole.SUPER_ADMIN]: 3
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

  @Column({ type: "enum", enum: UserRole, enumName: "user_role", default: UserRole.BASIC })
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
    user.role = props.role ?? UserRole.BASIC;
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
