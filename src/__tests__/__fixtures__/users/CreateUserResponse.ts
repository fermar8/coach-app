import { createUserDto } from './CreateUserDto';
import { UserEntity } from '../../../domain/users/entities';

export const createUserResponse: UserEntity = {
  id: 1,
  name: createUserDto.name,
  surname: createUserDto.surname,
  email: createUserDto.email,
  phone: createUserDto.phone,
  password: createUserDto.password,
  createdAt: new Date(),
  updatedAt: new Date(),
};
