import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { CreateOccupantDto } from './dtos/create-occupant.dto';
import { UpdateOccupantDto } from './dtos/update-occupant.dto';

@Controller('occupants')
export class OccupantsController {
  constructor(private http: HttpService) {}

  @Post()
  @ApiBody({ type: CreateOccupantDto })
  @ApiResponse({ status: 201, description: 'Occupant created successfully' })
  async create(@Body() body : CreateOccupantDto) {
    const res = await firstValueFrom(
      this.http.post('http://localhost:3001/occupants', body)
    );
    return res.data;
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get all Occupants' })
  async findAll() {
    const res = await firstValueFrom(
      this.http.get('http://localhost:3001/occupants')
    );
    return res.data;
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Get occupant by ID' })
  async findOne(@Param('id') id: string) {
    const res = await firstValueFrom(
      this.http.get(`http://localhost:3001/occupants/${id}`)
    );
    return res.data;
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateOccupantDto })
  @ApiResponse({ status: 200, description: 'Occupant updated successfully' })
  async update(@Param('id') id: string, @Body() body : UpdateOccupantDto) {
    const res = await firstValueFrom(
      this.http.patch(`http://localhost:3001/occupants/${id}`, body)
    );
    return res.data;
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Occupant deleted successfully' })
  async remove(@Param('id') id: string) {
    const res = await firstValueFrom(
      this.http.delete(`http://localhost:3001/occupants/${id}`)
    );
    return res.data;
  }
}
