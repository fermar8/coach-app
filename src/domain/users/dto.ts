import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';
import { userTypes } from './types';

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

  @IsIn(userTypes)
  userType: string;
}

export { CreateUserDto };
