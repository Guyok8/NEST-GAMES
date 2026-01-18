// Loads environment variables from .env file
import 'dotenv/config';
// Loads decorator metadata
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 3000;


// Starts the HTTP server
async function bootstrap() {
   //builds the entire app by reading modules/controllers/providers
  const app = await NestFactory.create(AppModule);
  // sets the global prefix for all routes
  app.setGlobalPrefix('api/v1'); 
  //starts the HTTP server
  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}

bootstrap();
