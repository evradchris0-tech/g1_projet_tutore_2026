import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(private http: HttpService) {}

  @Post()
  async create(@Body() body, @Req() req) {
    const res = await firstValueFrom(
      this.http.post('http://localhost:3001/users', body, {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }),
    );
    return res.data;
  }

  @Get()
  async findAll(@Req() req) {
    const res = await firstValueFrom(
      this.http.get('http://localhost:3001/users', {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }),
    );
    return res.data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const res = await firstValueFrom(
      this.http.get(`http://localhost:3001/users/${id}`, {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }),
    );
    return res.data;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body, @Req() req) {
    const res = await firstValueFrom(
      this.http.patch(`http://localhost:3001/users/${id}`, body, {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }),
    );
    return res.data;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const res = await firstValueFrom(
      this.http.delete(`http://localhost:3001/users/${id}`, {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }),
    );
    return res.data;
  }
}
