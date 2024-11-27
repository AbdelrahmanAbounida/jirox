import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import { APP_GUARD } from '@nestjs/core';
import { JWTAuthGuard } from './modules/auth/guards/jwt.guard';
import { CustomLogger } from './common/logging/app-logger';
import { AwsModule } from './common/services/aws/aws.module';
import { RedisModule } from './common/services/redis/redis.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import awsConfig from './config/aws.config';

@Module({
  imports: [
    // 1- configuration
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env', // ::TODO:: Load different one for testing
      load: [databaseConfig, appConfig, authConfig, awsConfig], // awsConfig
    }),
    // 2- Database
    DatabaseModule,

    // 3- modules
    AuthModule,
    UsersModule,
    DatabaseModule,
    AwsModule,
    RedisModule,
    WorkspacesModule,
    TasksModule,
    ProjectsModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [
    // services
    CustomLogger,
    {
      provide: APP_GUARD,
      useClass: JWTAuthGuard, // APIGuard, // JWTAuthGuard, we can add multiple guards
    },
  ],
})
export class AppModule {}
