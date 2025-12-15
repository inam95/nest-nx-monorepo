import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  override handleRequest<TUser>(err: Error | null, user: TUser, info: Error | undefined): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        code: "UNAUTHORIZED",
        message: info?.message || "Authentication required",
        type: "AUTHENTICATION"
      });
    }
    return user;
  }
}
