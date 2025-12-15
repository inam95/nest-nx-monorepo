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

  get frontendUrl() {
    return this.configService.get("FRONTEND_URL", { infer: true });
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
      jwtSecret: this.configService.get("JWT_SECRET", { infer: true }),
      accessExpiresIn: this.configService.get("JWT_ACCESS_EXPIRES_IN", { infer: true }),
      refreshExpiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN", { infer: true })
    };
  }

  get cookie() {
    return {
      domain: this.configService.get("COOKIE_DOMAIN", { infer: true }),
      secure: this.configService.get("COOKIE_SECURE", { infer: true }),
      sameSite: this.configService.get("COOKIE_SAME_SITE", { infer: true })
    };
  }

  get isLocal() {
    return this.nodeEnv === "local";
  }

  get isProduction() {
    return ["production", "test", "development"].includes(this.nodeEnv);
  }
}
