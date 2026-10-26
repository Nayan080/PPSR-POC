import { writeFileSync } from 'node:fs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const webOrigin = process.env.WEB_ORIGIN;
  app.enableCors({
    origin: webOrigin && webOrigin !== '*' ? webOrigin.split(',').map((o) => o.trim()) : true,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('PPSR PoC API')
    .setDescription('Personal Property Securities Register – proof of concept')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    // Clean operation ids give Orval readable hook names (e.g. useListRegistrations).
    operationIdFactory: (_controller, method) => method,
  });
  SwaggerModule.setup('api/docs', app, document);

  // Orval reads this file to generate the typed web client.
  if (process.env.NODE_ENV !== 'production') {
    writeFileSync(new URL('../openapi.json', import.meta.url), JSON.stringify(document, null, 2));
  }

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  console.log(`API on http://localhost:${port}/api  ·  Swagger UI on http://localhost:${port}/api/docs`);
}
await bootstrap();
