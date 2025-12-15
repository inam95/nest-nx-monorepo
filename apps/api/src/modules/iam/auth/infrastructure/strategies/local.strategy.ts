import { User } from "@modules/iam/users/domain/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import { ValidateCredentialsCommand } from "../../application/commands/validate-credentials";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private readonly commandBus: CommandBus) {
    super({ usernameField: "email", passwordField: "password" });
  }

  async validate(email: string, password: string): Promise<User> {
    return this.commandBus.execute(new ValidateCredentialsCommand(email, password));
  }
}
