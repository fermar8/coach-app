import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../../domain/users/entities';
import { CreateUserDto } from '../../domain/users/dto';
import { excludeFieldFromObject } from '../../utils/generalUtils';
import UsersModuleErrorMessages from '../../errorHandling/users/errorMessages';
import PrismaErrorCodes from '../../errorHandling/prisma/errorCodes';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
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
          throw new InternalServerErrorException(
            UsersModuleErrorMessages.USER_ALREADY_EXISTS,
          );
        }
      }
      throw new InternalServerErrorException(
        UsersModuleErrorMessages.USER_CREATE_ERROR,
      );
    }
  }

  async getUserById(id: number): Promise<UserEntity> {
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
        throw new NotFoundException(UsersModuleErrorMessages.USER_NOT_FOUND);
      }
      const userWithoutPassword = excludeFieldFromObject(user, ['password']);
      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('error');
    }
  }
}
