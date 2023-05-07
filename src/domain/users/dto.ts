import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';
import { userRolesTypes } from './types';

class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  password: string;

  @IsIn(userRolesTypes)
  role: string;
}

export { CreateUserDto };
