import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admins')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() body) {
    return this.service.create(body);
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.service.update(id, body);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
