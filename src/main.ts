import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { logger } from './middleware/log-events.middleware';
import corsOptions from './config/corsOptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsOptions);

  app.use(cookieParser());
  app.use(logger);
  await app.listen(3500);
}
bootstrap();
