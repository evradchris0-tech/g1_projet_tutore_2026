import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';

import { firstValueFrom } from 'rxjs';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminDto } from './dtos/update-admin.dto';

@ApiTags('Admins')
@Controller('admins')
export class AdminsController {
  constructor(private http: HttpService) {}

  @Post()
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  async create(@Body() body: CreateAdminDto) {
    const res = await firstValueFrom(
      this.http.post('http://localhost:3001/admins', body)
    );
    return res.data;
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get all admins' })
  async findAll() {
    const res = await firstValueFrom(
      this.http.get('http://localhost:3001/admins')
    );
    return res.data;
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Get admin by ID' })
  async findOne(@Param('id') id: string) {
    const res = await firstValueFrom(
      this.http.get(`http://localhost:3001/admins/${id}`)
    );
    return res.data;
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateAdminDto })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  async update(@Param('id') id: string, @Body() body: UpdateAdminDto) {
    const res = await firstValueFrom(
      this.http.patch(`http://localhost:3001/admins/${id}`, body)
    );
    return res.data;
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  async remove(@Param('id') id: string) {
    const res = await firstValueFrom(
      this.http.delete(`http://localhost:3001/admins/${id}`)
    );
    return res.data;
  }
}
