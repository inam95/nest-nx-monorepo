import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { TEnv } from "./env.schema";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<TEnv, true>) {}

  get nodeEnv() {
    return this.configService.get("NODE_ENV", { infer: true });
  }

  get port() {
    return this.configService.get("PORT", { infer: true });
  }

  get database() {
    return {
      host: this.configService.get("DB_HOST", { infer: true }),
      port: this.configService.get("DB_PORT", { infer: true }),
      username: this.configService.get("DB_USERNAME", { infer: true }),
      password: this.configService.get("DB_PASSWORD", { infer: true }),
      name: this.configService.get("DB_NAME", { infer: true })
    };
  }

  get jwt() {
    return {
      accessSecret: this.configService.get("JWT_ACCESS_SECRET", { infer: true }),
      refreshSecret: this.configService.get("JWT_REFRESH_SECRET", { infer: true }),
      accessExpiresIn: this.configService.get("JWT_ACCESS_EXPIRES_IN", { infer: true }),
      refreshExpiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN", { infer: true })
    };
  }

  get isDevelopment() {
    return this.nodeEnv === "development";
  }

  get isProduction() {
    return this.nodeEnv === "production";
  }
}
