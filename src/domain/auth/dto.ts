import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString } from 'class-validator';

export abstract class ConfirmEmailDto {
  @ApiProperty()
  @IsString()
  @IsJWT()
  confirmationToken: string;
}
