import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Sockets Service')
    .setDescription('Sockets Service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  app.useStaticAssets(join(__dirname, '..', 'static'));
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();