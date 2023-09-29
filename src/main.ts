import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as connectRedis from 'connect-redis';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // initi reddis client
  const RedisStore = connectRedis(session);
  const redisClient = createClient({
    url: configService.getOrThrow('REDIS_URL'),
    legacyMode: true,
  });

  app.use(
    session({
      secret: configService.getOrThrow('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({
        client: redisClient,
        prefix: 'expenses-app:',
      }),
    }),
  );

  await redisClient.connect().catch((error) => {
    throw error;
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(3333);
}
bootstrap();
