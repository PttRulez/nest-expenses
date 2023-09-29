import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AdminGuard, SessionGuard } from './auth/guards';
import { ExpenseModule } from './expense/expense.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';

const reflector = new Reflector();

@Module({
  imports: [
    AuthModule,
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          store: redisStore,
          url: config.getOrThrow('REDIS_URL'),
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ExpenseModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    SchedulerModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useValue: new SessionGuard(reflector),
    },
    {
      provide: APP_GUARD,
      useValue: new AdminGuard(reflector),
    },
  ],
})
export class AppModule {}
