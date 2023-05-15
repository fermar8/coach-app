import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  I18nModule,
  CookieResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from './modules/prisma/prisma.module';
import {
  UsersModule,
  UsersController,
  UsersService,
  UsersRepository,
} from './modules/users';
import { AuthModule, AuthController, AuthService } from './modules/auth';
import { MailerModule, MailerService } from './modules/mailer';
import { CommonModule, CommonService } from './modules/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.test'],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        type: 'json',
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: CookieResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MailerModule,
    CommonModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    UsersRepository,
    AuthService,
    MailerService,
    CommonService,
    JwtService,
  ],
})
export class AppModule {}
