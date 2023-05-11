import { CreateUserDto } from '../../../domain/users/dto';

export const mockCreateUserDto: CreateUserDto = {
  name: 'John',
  surname: 'Doe',
  email: 'coach@example.com',
  phone: '555-555-5555',
  password: '123456789',
  role: 'coach',
};
