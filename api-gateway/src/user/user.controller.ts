import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private http: HttpService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user ' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async create(@Body() body: CreateUserDto, @Req() req) {
    const res = await firstValueFrom(
      this.http.post('http://localhost:3001/users', body, {
        headers: { Authorization: req.headers['authorization'] },
      }),
    );
    return res.data;
  }

  // FIND ALL ---------------------------------
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  async findAll(@Req() req) {
    const res = await firstValueFrom(
      this.http.get('http://localhost:3001/users', {
        headers: { Authorization: req.headers['authorization'] },
      }),
    );
    return res.data;
  }

  // FIND ONE ---------------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string, @Req() req) {
    const res = await firstValueFrom(
      this.http.get(`http://localhost:3001/users/${id}`, {
        headers: { Authorization: req.headers['authorization'] },
      }),
    );
    return res.data;
  }

  // UPDATE -----------------------------------
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  async update(@Param('id') id: string, @Body() body: UpdateUserDto, @Req() req) {
    const res = await firstValueFrom(
      this.http.patch(`http://localhost:3001/users/${id}`, body, {
        headers: { Authorization: req.headers['authorization'] },
      }),
    );
    return res.data;
  }

  // DELETE -----------------------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  async remove(@Param('id') id: string, @Req() req) {
    const res = await firstValueFrom(
      this.http.delete(`http://localhost:3001/users/${id}`, {
        headers: { Authorization: req.headers['authorization'] },
      }),
    );
    return res.data;
  }
  
}
