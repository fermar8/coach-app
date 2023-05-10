import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import {
  UsersModule,
  UsersController,
  UsersService,
  UsersRepository,
} from './modules/users';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.test'],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, UsersRepository, AuthService, JwtService],
})
export class AppModule {}
