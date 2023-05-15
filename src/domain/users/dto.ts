import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { userRolesTypes } from './types';

class UserDto {
  @ApiProperty({
    example: 'anEmail@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'aPassword@123',
  })
  @IsNotEmpty()
  password: string;
}

class CreateUserDto extends UserDto {
  @ApiProperty({
    example: 'John',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsNotEmpty()
  surname: string;

  @ApiProperty({
    example: '555555555',
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'coach',
  })
  @IsIn(userRolesTypes)
  role: string;
}

export { UserDto, CreateUserDto };
