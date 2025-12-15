import { Inject, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import * as bcrypt from "bcrypt";

import { User } from "@/modules/iam/users/domain/entities/user.entity";
import { type IUserRepository, USER_REPOSITORY } from "@/modules/iam/users/domain/ports/user.repository.interface";

import { ValidateCredentialsCommand } from "./validate-credentials.command";

@CommandHandler(ValidateCredentialsCommand)
export class ValidateCredentialsHandler implements ICommandHandler<ValidateCredentialsCommand, User> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(command: ValidateCredentialsCommand): Promise<User> {
    const { email, password } = command;

    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user) {
      // Don't reveal whether email exists
      throw new UnauthorizedException({
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
        type: "BUSINESS"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
        type: "BUSINESS"
      });
    }
    return user;
  }
}
