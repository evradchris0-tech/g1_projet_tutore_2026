import { Controller, Post, Body, Get, Query, Param, Patch, Delete } from '@nestjs/common';
import { BatimentService } from './batiment.service';
import { CreateBatimentDto } from './dtos/create-batiment.dto';
import { UpdateBatimentDto } from './dtos/update-batiment.dto';


@Controller('batiments')
export class BatimentController {
  constructor(private readonly service: BatimentService) {}

  @Post()
  create(@Body() dto: CreateBatimentDto) {
    return this.service.create(dto);
  }

  @Get()
  search(@Query() query: any) {
    return this.service.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBatimentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
