import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../auth/dtos/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('ADMIN')
  @Get()
  async findAll(@Req() req) {
    const user = req.user;
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can view all users');
    }
    return this.usersService.findAll();
  }

  @Roles('ADMIN')
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const user = req.user;
    if (user.role !== 'ADMIN' && user.userId !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.usersService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req,
  ) {
    const user = req.user;
    if (user.role !== 'ADMIN' && user.userId !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(id, dto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    const user = req.user;
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete users');
    }
    return this.usersService.delete(id);
  }
}
