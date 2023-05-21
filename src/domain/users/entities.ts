import { User as UserPrisma } from '@prisma/client';
import { userRolesTypes } from './types';
import { IsIn } from 'class-validator';

class UserEntity implements UserPrisma {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  isConfirmed: boolean;

  admin?: UserEntityExtension | null;
  coach?: UserEntityExtension | null;
  player?: UserEntityExtension | null;

  createdAt: Date;
  updatedAt: Date;
}

class UserEntityExtension {
  id: number;
  userId: number;

  @IsIn(userRolesTypes)
  role: string;
}

export { UserEntity };
