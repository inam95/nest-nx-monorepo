import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppConfigService } from "../config";

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: AppConfigService) => ({
        type: "postgres",
        host: config.database.host,
        port: config.database.port,
        username: config.database.username,
        password: config.database.password,
        database: config.database.name,
        autoLoadEntities: true,
        synchronize: config.isDevelopment,
        logging: config.isDevelopment
      }),
      inject: [AppConfigService]
    })
  ]
})
export class DatabaseModule {}
