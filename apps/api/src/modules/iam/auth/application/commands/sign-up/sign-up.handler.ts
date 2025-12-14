import { ConflictException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import * as bcrypt from "bcrypt";

import { User } from "@/modules/iam/users/domain/entities/user.entity";
import { type IUserRepository, USER_REPOSITORY } from "@/modules/iam/users/domain/ports/user.repository.interface";

import { SignUpCommand } from "./sign-up.command";

@CommandHandler(SignUpCommand)
export class SignupHandler implements ICommandHandler<SignUpCommand> {
  private readonly SALT_ROUNDS = 12;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(command: SignUpCommand): Promise<{ id: string }> {
    const { email, password, firstName, lastName } = command;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException({
        code: "USER_CONFLICT",
        message: "User already exists",
        type: "BUSINESS"
      });
    }

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    const user = User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    const savedUser = await this.userRepository.save(user);

    return { id: savedUser.id };
  }
}
