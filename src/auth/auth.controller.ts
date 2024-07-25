import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingnupDto } from 'src/dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(@Body() signup: SingnupDto) {
    return await this.authService.register(signup);
  }
}
