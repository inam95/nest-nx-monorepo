import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/ports/user.repository.interface";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  create(user: Partial<User>): User {
    const newUser = this.userRepository.create(user);
    return newUser;
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async incrementTokenVersion(id: string): Promise<void> {
    await this.userRepository.increment({ id }, "tokenVersion", 1);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
