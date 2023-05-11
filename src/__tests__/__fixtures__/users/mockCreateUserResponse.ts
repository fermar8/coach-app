import { mockCreateUserDto } from './mockCreateUserDto';
import { UserEntity } from '../../../domain/users/entities';

export const mockCreateUserResponse: UserEntity = {
  id: 1,
  name: mockCreateUserDto.name,
  surname: mockCreateUserDto.surname,
  email: mockCreateUserDto.email,
  phone: mockCreateUserDto.phone,
  password: '123456789',
  createdAt: new Date(),
  updatedAt: new Date(),
};
