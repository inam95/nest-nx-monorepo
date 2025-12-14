import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";

import { AppModule } from "./app.module";
import { AppConfigService } from "./shared/config";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const logger = new Logger(bootstrap.name);

  const configService = app.get(AppConfigService);
  const port = configService.port;
  const isLocal = configService.isLocal;
  const frontendUrl = configService.frontendUrl;
  const globalPrefix = "api";

  app.setGlobalPrefix(globalPrefix);

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  });

  if (isLocal) {
    configureSwagger(app);
  }

  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle("Example API").setDescription("Example API description").setVersion("1.0").build()
  );

  SwaggerModule.setup("api", app, cleanupOpenApiDoc(openApiDoc));
  await app.listen(port);
  logger.log(`Server is running on port ${port}`);
  if (isLocal) {
    logger.log(`Swagger is running on http://localhost:${port}/api/docs`);
  }
}

const configureSwagger = (app: NestFastifyApplication) => {
  const config = new DocumentBuilder()
    .setTitle("Nest NX Monorepo API")
    .setDescription("Nest NX Monorepo API Documentation")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, cleanupOpenApiDoc(document), {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha"
    }
  });
};
void bootstrap();
