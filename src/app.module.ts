import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { VerifyAccessToken } from './middlewares/verify-access-token';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { TaskModule } from './task/task.module';
import { UserController } from './user/user.controller';
import { TaskController } from './task/task.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DB_URI'),
        dbName: 'todo-app-db',
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    UserModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyAccessToken)
      .exclude(
        {
          path: 'auth/register',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/login',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/refresh-access-token',
          method: RequestMethod.POST,
        },
      )
      .forRoutes(AuthController, UserController, TaskController);
  }
}
