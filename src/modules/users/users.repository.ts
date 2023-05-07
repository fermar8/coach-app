import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../../domain/users/entities';
import { CreateUserDto } from '../../domain/users/dto';
import { excludeFieldFromObject } from '../../utils/generalUtils';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { name, surname, email, phone, password, role } = createUserDto;
    return await this.prismaService.user.create({
      data: {
        name,
        surname,
        email,
        phone,
        password,
        [role]: {
          create: {
            role,
          },
        },
      },
    });
  }

  async getUserById(id: number): Promise<UserEntity | NotFoundException> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        admin: true,
        coach: true,
        player: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userWithoutPassword = excludeFieldFromObject(user, ['password']);
    return userWithoutPassword;
  }
}
