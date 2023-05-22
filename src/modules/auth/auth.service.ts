import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../domain/users/entities';
import { TokenTypeEnum } from '../../domain/auth/types';
import { FastifyReply } from 'fastify';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

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
        console.log('confirmTokenPayload', confirmTokenPayload);
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

  public saveRefreshCookie(
    res: FastifyReply,
    refreshToken: string,
  ): FastifyReply {
    const refreshTime = process.env.JWT_REFRESH_TIME as unknown as number;
    return res
      .cookie('rf', refreshToken, {
        secure: true,
        httpOnly: true,
        signed: true,
        path: '/users',
        expires: new Date(Date.now() + refreshTime * 1000),
      })
      .header('Content-Type', 'application/json');
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
