import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Occupant } from './occupant.entity';

@Injectable()
export class OccupantService {
  constructor(@InjectRepository(Occupant) private readonly repo: Repository<Occupant>) {}

  async create(data: Partial<Occupant>) {
    const occupant = this.repo.create(data);
    return this.repo.save(occupant);
  }

  async findAll() {
    return this.repo.find({ relations: ['user'] });
  }

  async findOne(id: string) {
    const occupant = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!occupant) throw new NotFoundException('Occupant not found');
    return occupant;
  }

  async update(id: string, data: Partial<Occupant>) {
    const occupant = await this.findOne(id);
    Object.assign(occupant, data);
    return this.repo.save(occupant);
  }

  async remove(id: string) {
    const occupant = await this.findOne(id);
    return this.repo.remove(occupant);
  }
}
