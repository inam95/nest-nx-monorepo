import { BaseEntity } from "@shared/database";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { User } from "@/modules/iam/users/domain/entities/user.entity";

@Entity("refresh_tokens")
@Index("idx_refresh_tokens_user_id", ["userId"])
export class RefreshToken extends BaseEntity {
  @Column({ name: "token" })
  declare token: string;

  @Column({ name: "user_id", type: "uuid" })
  declare userId: string;

  @Column({ name: "expires_at", type: "timestamptz" })
  declare expiresAt: Date;

  @Column({ name: "revoked_at", type: "timestamptz", nullable: true })
  declare revokedAt: Date | null;

  @Column({ name: "user_agent", nullable: true, type: "varchar" })
  declare userAgent: string | null;

  @Column({ name: "ip_address", nullable: true, type: "varchar" })
  declare ipAddress: string | null;

  @Column({ name: "is_used", nullable: true, type: "timestamptz" })
  declare lastUsedAt: Date | null;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  declare user: User;

  static create(props: {
    token: string;
    userId: string;
    expiresAt: Date;
    userAgent?: string | null;
    ipAddress?: string | null;
  }): RefreshToken {
    const token = new RefreshToken();
    token.token = props.token;
    token.userId = props.userId;
    token.expiresAt = props.expiresAt;
    token.userAgent = props.userAgent ?? null;
    token.ipAddress = props.ipAddress ?? null;
    token.revokedAt = null;
    token.lastUsedAt = null;
    return token;
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  get isRevoked(): boolean {
    return this.revokedAt !== null;
  }

  get isValid(): boolean {
    return !this.isExpired && !this.isRevoked;
  }

  revoke(): void {
    this.revokedAt = new Date();
  }

  updateLastUsed(): void {
    this.lastUsedAt = new Date();
  }
}
