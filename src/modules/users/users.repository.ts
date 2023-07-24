import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../../domain/users/entities';
import { CreateUserDto } from '../../domain/users/dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
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

  public async getUserById(id: number): Promise<UserEntity> {
    try {
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
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async getUserByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
        include: {
          admin: true,
          coach: true,
          player: true,
        },
      });
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async updateUserById(
    id: number,
    user: UserEntity,
  ): Promise<UserEntity> {
    const updatedUser = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        isConfirmed: user.isConfirmed,
      },
    });

    return updatedUser;
  }
}
