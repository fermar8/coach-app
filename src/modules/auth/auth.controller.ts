import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@Body() body: any): Promise<any> {
    // return await this.authService.createUser(body);
  }
}
