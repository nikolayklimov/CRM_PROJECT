import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const reflector = app.get(Reflector);
    app.useGlobalGuards(
      new JwtAuthGuard(reflector),
      new RolesGuard(reflector),
    );

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000);
    console.log('App is running on http://localhost:3000');
  } catch (error) {
    console.error('Error starting the app:', error);
  }
}
bootstrap();