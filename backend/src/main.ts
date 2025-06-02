import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';

// Точка входа в приложение
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Настройка CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Разрешаем запросы с frontend
    credentials: true, // Разрешаем отправку cookies (если потребуется в будущем)
  });
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  await app.listen(3000); // Сервер запускается на порту 3000
}
bootstrap();
