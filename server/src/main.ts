import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api/v2');

  const config = new DocumentBuilder()
    .setTitle('SIMRS Enterprise API Ecosystem')
    .setDescription('Clean Architecture SIMRS Enterprise Full Stack API (SATUSEHAT FHIR R4, BPJS VClaim 2.0, LIS ASTM, PACS DICOMweb)')
    .setVersion('2.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`[SIMRS Enterprise Backend] Running on http://localhost:${port}/api/v2`);
  console.log(`[Swagger OpenAPI Docs] Available at http://localhost:${port}/api/docs`);
}

bootstrap();
