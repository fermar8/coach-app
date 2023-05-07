import { createUserDto } from './CreateUserDto';
import { User } from '@prisma/client';

export const createUserResponse: User = {
  id: 1,
  name: createUserDto.name,
  surname: createUserDto.surname,
  email: createUserDto.email,
  phone: createUserDto.phone,
  password: createUserDto.password,
  createdAt: new Date(),
  updatedAt: new Date(),
};
