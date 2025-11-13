import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Controller('agents')
export class AgentsController {
  constructor(private http: HttpService) {}

  @Post()
  async create(@Body() body) {
    const res = await firstValueFrom(
      this.http.post('http://localhost:3001/agents', body)
    );
    return res.data;
  }

  @Get()
  async findAll() {
    const res = await firstValueFrom(
      this.http.get('http://localhost:3001/agents')
    );
    return res.data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await firstValueFrom(
      this.http.get(`http://localhost:3001/agents/${id}`)
    );
    return res.data;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body) {
    const res = await firstValueFrom(
      this.http.patch(`http://localhost:3001/agents/${id}`, body)
    );
    return res.data;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await firstValueFrom(
      this.http.delete(`http://localhost:3001/agents/${id}`)
    );
    return res.data;
  }
}
