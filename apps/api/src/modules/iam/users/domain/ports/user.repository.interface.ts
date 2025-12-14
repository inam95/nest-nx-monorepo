import type { User } from "../entities/user.entity";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: Partial<User>): User;
  delete(id: string): Promise<void>;
  save(user: User): Promise<User>;
  incrementTokenVersion(id: string): Promise<void>;
  findByEmailWithPassword(email: string): Promise<User | null>;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");
