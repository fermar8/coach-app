import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../domain/users/entities';
import { CreateUserDto } from '../../domain/users/dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(body: CreateUserDto): Promise<User> {
    body.password = await bcrypt.hash(body.password, 10);
    const user = await this.prisma.user.create({
      data: body,
    });
    return user;
  }
}
