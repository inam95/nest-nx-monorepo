import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { IamModule } from "./modules/iam/iam.module";
import { AppConfigModule } from "./shared/config";

@Module({
  imports: [AppConfigModule, CqrsModule.forRoot(), IamModule],
  controllers: [],
  providers: []
})
export class AppModule {}
