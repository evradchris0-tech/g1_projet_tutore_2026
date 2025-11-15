import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { OccupantService } from './occupant.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('occupants')
export class OccupantController {
  constructor(private readonly service: OccupantService) {}

  // ADMIN ONLY
  @Roles('ADMIN')
  @Post()
  create(@Body() body) {
    return this.service.create(body);
  }

  // ADMIN + AGENT
  @Roles('ADMIN', 'AGENT')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ADMIN, AGENT, OCCUPANT
  @Roles('ADMIN', 'AGENT', 'OCCUPANT')
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const user = req.user;

    // OCCUPANT can only see themselves
    if (user.role === 'OCCUPANT' && user.userId !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }

    return this.service.findOne(id);
  }

  // ADMIN, AGENT, OCCUPANT
  @Roles('ADMIN', 'AGENT', 'OCCUPANT')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any, @Req() req) {
    const user = req.user;

    // OCCUPANT can only update themselves
    if (user.role === 'OCCUPANT' && user.userId !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.service.update(id, dto);
  }

  // ADMIN ONLY
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
