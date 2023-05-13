import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/domain/users/entities';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async createJwtToken(user: UserEntity): Promise<string> {
    const payload = { name: user.name, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.SESSION_KEY,
      expiresIn: '7d',
    });
    return `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${process.env.COOKIE_MAX_AGE}`;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async validateUserPassword(
    userPassword: string,
    hashedUserPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(userPassword, hashedUserPassword);
  }
}
