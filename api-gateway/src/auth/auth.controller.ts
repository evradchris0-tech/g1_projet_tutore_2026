import { HttpService } from '@nestjs/axios';
import { Controller, Post, Body, Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from './dtos/register.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private http: HttpService) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User Registered successfully' })
  async register(@Body() body: RegisterDto) {
    const res = await firstValueFrom(
      this.http.post('http://localhost:3001/auth/register', body),
    );
    return res.data;
  }

  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'User Login successfully' })
  @Post('login')
  async login(@Body() body: LoginDto) {
    const res = await firstValueFrom(
      this.http.post('http://localhost:3001/auth/login', body),
    );
    return res.data;
  }
}
