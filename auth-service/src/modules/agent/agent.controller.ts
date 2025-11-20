import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
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

  @Roles('ADMIN')
  @Get('/search')
  searchAgents(
    @Query('search') search: string,
    @Query('speciality') speciality: string,
    @Query('supervisor') supervisor: string,
    @Query('isActive') isActive: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('order') order: 'ASC' | 'DESC' = 'DESC'
  ) {
    return this.service.searchAgents({
      search,
      speciality,
      supervisor,
      isActive,
      page: Number(page),
      limit: Number(limit),
      sortBy,
      order,
    });
  }
}
