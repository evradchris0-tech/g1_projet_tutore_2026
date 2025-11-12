import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() b: any) {
    return this.auth.register(b.username, b.password, b.role);
  }

  @Post('login')
  login(@Body() b: any) {
    return this.auth.login(b.username, b.password);
  }
}
