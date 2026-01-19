import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

const PORT = 3000;

async function bootstrap() {
  // creates the app instance
  const app = await NestFactory.create(AppModule);

  // sets the global prefix for all routes
  app.setGlobalPrefix('api/v1');

  // validates the data received from the client
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}

bootstrap();
