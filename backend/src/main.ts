import { NestFactory } from '@nestjs/core';  // Добавьте этот импорт для NestFactory
import { AppModule } from './app.module';    // Добавьте этот импорт для AppModule
import { RolesGuard } from './auth/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);  // Здесь создаём приложение, используя AppModule
    const reflector = app.get(Reflector);
    // app.useGlobalGuards(
    //   new JwtAuthGuard(),
    //   new RolesGuard(reflector),
    // );
    await app.listen(3000); // Прослушивание порта
    console.log('App is running on http://localhost:3000');
  } catch (error) {
    console.error('Error starting the app:', error);
  }
}
bootstrap();