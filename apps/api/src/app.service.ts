import type { CreateUserDto, User } from '@nest-nx-monorepo/shared-types';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  createUser(user: CreateUserDto): User {
    return {
      id: crypto.randomUUID(),
      email: user.email,
      name: user.name,
    };
  }
}
