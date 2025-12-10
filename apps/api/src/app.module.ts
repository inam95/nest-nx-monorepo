import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { CqrsModule } from "@nestjs/cqrs";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";

import { IamModule } from "./modules/iam/iam.module";
import { AppConfigModule } from "./shared/config";
import { RequestContextModule } from "./shared/context";
import { DatabaseModule } from "./shared/database";
import { GlobalExceptionFilter } from "./shared/filters/global-exception.filter";

@Module({
  imports: [AppConfigModule, RequestContextModule, DatabaseModule, CqrsModule.forRoot(), IamModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter
    }
  ]
})
export class AppModule {}
