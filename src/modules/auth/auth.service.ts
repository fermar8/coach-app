import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../domain/users/entities';
import { TokenTypeEnum } from '../../domain/auth/types';
import { FastifyReply } from 'fastify';
import { IAuthResult } from '../../domain/auth/interfaces';
import { CommonService } from '../common/common.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
    private readonly i18n: I18nService,
  ) {}

  public async createJwtToken(
    user: Omit<UserEntity, 'password'>,
    tokenType: TokenTypeEnum,
  ): Promise<string> {
    const payload = { name: user.name, id: user.id };

    switch (tokenType) {
      case TokenTypeEnum.ACCESS:
        return await this.jwtService.signAsync(payload, {
          secret: process.env.COOKIE_SECRET,
          expiresIn: process.env.JWT_ACCESS_TIME,
        });
      case TokenTypeEnum.REFRESH:
        return await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_TIME,
        });
      case TokenTypeEnum.CONFIRMATION:
        return await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_CONFIRMATION_SECRET,
          expiresIn: '1d',
        });
      case TokenTypeEnum.RESET_PASSWORD:
        return await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_RESET_PASSWORD_SECRET,
          expiresIn: process.env.JWT_RESET_PASSWORD_TIME,
        });
    }
  }

  public async verifyToken(
    token: string,
    tokenType: TokenTypeEnum,
  ): Promise<number> {
    switch (tokenType) {
      case TokenTypeEnum.ACCESS:
        const accessTokenPayload = await this.jwtService.verifyAsync(token, {
          secret: process.env.COOKIE_SECRET,
          maxAge: process.env.JWT_ACCESS_TIME,
        });
        return accessTokenPayload.id;
      case TokenTypeEnum.REFRESH:
        const refreshTokenPayload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_REFRESH_SECRET,
          maxAge: process.env.JWT_REFRESH_TIME,
        });
        return refreshTokenPayload.id;
      case TokenTypeEnum.CONFIRMATION:
        const confirmTokenPayload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_CONFIRMATION_SECRET,
          maxAge: '1d',
        });
        return confirmTokenPayload.id;
      case TokenTypeEnum.RESET_PASSWORD:
        const resetTokenPayload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_RESET_PASSWORD_SECRET,
          maxAge: process.env.JWT_RESET_PASSWORD_TIME,
        });
        return resetTokenPayload.id;
    }
  }

  public async generateAuthTokens(user: UserEntity): Promise<[string, string]> {
    return Promise.all([
      this.createJwtToken(user, TokenTypeEnum.ACCESS),
      this.createJwtToken(user, TokenTypeEnum.REFRESH),
    ]);
  }

  public saveRfCookieAndSendUserAndAccessCookie(
    res: FastifyReply,
    authResult: IAuthResult,
    locale: string,
  ): FastifyReply {
    const refreshTime = process.env.JWT_REFRESH_TIME as unknown as number;
    const confirmedMessage = this.commonService.generateMessage(
      this.i18n.t('users.confirmation_message', { lang: locale }),
    );
    return res
      .cookie('rf', authResult.refreshToken, {
        secure: true,
        httpOnly: true,
        signed: true,
        path: '/users',
        expires: new Date(Date.now() + refreshTime * 1000),
      })
      .header('Content-Type', 'application/json')
      .send({
        user: authResult.user,
        accessToken: authResult.accessToken,
        message: confirmedMessage.message,
      });
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async validateUserPassword(
    userPassword: string,
    hashedUserPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(userPassword, hashedUserPassword);
  }
}
