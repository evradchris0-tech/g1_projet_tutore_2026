import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { CreateAgentDto } from './dtos/create-agent.dto';
import { UpdateAgentDto } from './dtos/update-agent.dto';

@Controller('agents')
export class AgentsController {
  constructor(private http: HttpService) {}

  @Post()
  @ApiBody({ type: CreateAgentDto })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  async create(@Body() body : CreateAgentDto) {
    const res = await firstValueFrom(
      this.http.post('http://localhost:3001/agents', body)
    );
    return res.data;
  }


  @Get()
  @ApiResponse({ status: 200, description: 'Get all agents' })
  async findAll() {
    const res = await firstValueFrom(
      this.http.get('http://localhost:3001/agents')
    );
    return res.data;
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Get Agent by ID' })
  async findOne(@Param('id') id: string) {
    const res = await firstValueFrom(
      this.http.get(`http://localhost:3001/agents/${id}`)
    );
    return res.data;
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateAgentDto })
  @ApiResponse({ status: 200, description: 'Agent updated successfully' })
  async update(@Param('id') id: string, @Body() body : UpdateAgentDto) {
    const res = await firstValueFrom(
      this.http.patch(`http://localhost:3001/agents/${id}`, body)
    );
    return res.data;
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Agent deleted successfully' })
  async remove(@Param('id') id: string) {
    const res = await firstValueFrom(
      this.http.delete(`http://localhost:3001/agents/${id}`)
    );
    return res.data;
  }
}
