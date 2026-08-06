import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api/v2');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`[SIMRS Enterprise Backend Microservices] Running on http://localhost:${port}/api/v2`);
}

bootstrap();
