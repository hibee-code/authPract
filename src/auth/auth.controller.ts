import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from 'src/dto/signin.dto';
import { SignupDto } from 'src/dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(@Body() signup: SignupDto) {
    return await this.authService.register(signup);
  }

  @Post('login')
  async signin(@Body() signin: SigninDto) {
    return await this.authService.login(signin);
  }
}
