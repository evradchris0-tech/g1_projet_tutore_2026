import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { AgentService } from './agent.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('agents')
export class AgentController {
  constructor(private readonly service: AgentService) {}

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

  @Roles('ADMIN,AGENT')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles('ADMIN,AGENT')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
