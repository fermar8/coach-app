import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../domain/users/entities';
import { TokenTypeEnum } from '../../domain/auth/types';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async createJwtToken(
    user: Omit<UserEntity, 'password'>,
    tokenType: TokenTypeEnum,
  ): Promise<string> {
    const payload = { name: user.name, sub: user.id };

    switch (tokenType) {
      case TokenTypeEnum.ACCESS:
        const accessTokenSecret = process.env.COOKIE_SECRET;
        const accessTokenExpiration = process.env.JWT_ACCESS_TIME;
        return await this.jwtService.signAsync(payload, {
          secret: accessTokenSecret,
          expiresIn: accessTokenExpiration,
        });
      case TokenTypeEnum.REFRESH:
        const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
        const refreshTokenExpiration = process.env.JWT_REFRESH_TIME;
        return await this.jwtService.signAsync(payload, {
          secret: refreshTokenSecret,
          expiresIn: refreshTokenExpiration,
        });
      case TokenTypeEnum.CONFIRMATION:
        const confirmationTokenSecret = process.env.JWT_CONFIRMATION_SECRET;
        const confirmationTokenExpiration = process.env.JWT_CONFIRMATION_TIME;
        return await this.jwtService.signAsync(payload, {
          secret: confirmationTokenSecret,
          expiresIn: confirmationTokenExpiration,
        });
      case TokenTypeEnum.RESET_PASSWORD:
        const resetPasswordTokenSecret = process.env.JWT_RESET_PASSWORD_SECRET;
        const resetPasswordTokenExpiration =
          process.env.JWT_RESET_PASSWORD_TIME;
        return await this.jwtService.signAsync(payload, {
          secret: resetPasswordTokenSecret,
          expiresIn: resetPasswordTokenExpiration,
        });
    }
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
