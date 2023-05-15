import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../../domain/users/entities';
import { CreateUserDto } from '../../domain/users/dto';
import PrismaErrorCodes from '../../errorHandling/prisma/errorCodes';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_VIOLATION) {
          throw new BadRequestException();
        }
      }
      throw new InternalServerErrorException();
    }
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
      throw new InternalServerErrorException();
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
      throw new InternalServerErrorException();
    }
  }
}
