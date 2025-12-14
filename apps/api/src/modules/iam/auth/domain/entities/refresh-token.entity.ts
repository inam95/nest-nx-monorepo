import { BaseEntity } from "@shared/database";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { User } from "@/modules/iam/users/domain/entities/user.entity";

@Entity("refresh_tokens")
@Index("idx_refresh_tokens_user_id", ["userId"])
export class RefreshToken extends BaseEntity {
  @Column({ name: "hashed_token" })
  declare hashedToken: string;

  @Column({ name: "user_id", type: "uuid" })
  declare userId: string;

  @Column({ name: "expires_at", type: "timestamptz" })
  declare expiresAt: Date;

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
    hashedToken: string;
    userId: string;
    expiresAt: Date;
    userAgent?: string | null;
    ipAddress?: string | null;
  }): RefreshToken {
    const token = new RefreshToken();
    token.hashedToken = props.hashedToken;
    token.userId = props.userId;
    token.expiresAt = props.expiresAt;
    token.userAgent = props.userAgent ?? null;
    token.ipAddress = props.ipAddress ?? null;
    token.lastUsedAt = null;
    return token;
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  get expiresInMs(): number {
    return Math.max(0, this.expiresAt.getTime() - Date.now());
  }

  get expiresInSeconds(): number {
    return Math.floor(this.expiresInMs / 1000);
  }

  touchLastUsed(): void {
    this.lastUsedAt = new Date();
  }

  wasUsedWithin(ms: number): boolean {
    if (!this.lastUsedAt) return false;
    return Date.now() - this.lastUsedAt.getTime() < ms;
  }
}
