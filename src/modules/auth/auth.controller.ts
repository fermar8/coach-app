import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/invite')
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvite(@Body() body: any): Promise<any> {
    // return await this.authService.createUser(body);
  }
}
