import { HttpService } from '@nestjs/axios';
import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
   constructor(private http: HttpService) {}

   @Post('register')
  async register(@Body() body) {
    const res = await firstValueFrom(
      this.http.post('http://localhost:3001/auth/register', body)
    );
    return res.data;
  }

  @Post('login')
  async login(@Body() body) {
    const res = await firstValueFrom(
      this.http.post('http://localhost:3001/auth/login', body)
    );
    return res.data;
  }
}
