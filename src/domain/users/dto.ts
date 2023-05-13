import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { userRolesTypes } from './types';

class UserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

class CreateUserDto extends UserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  surname: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsIn(userRolesTypes)
  role: string;
}

export { UserDto, CreateUserDto };
