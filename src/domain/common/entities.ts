import { ApiProperty } from '@nestjs/swagger';
import { IMessage } from './interfaces';

class MessageEntity implements IMessage {
  @ApiProperty({
    example: 'Hello World',
  })
  public message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export { MessageEntity };
