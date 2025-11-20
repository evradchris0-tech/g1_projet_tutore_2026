import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Occupant } from './occupant.entity';
import { SearchOccupantDto } from './dtos/SearchOccupantDto';

@Injectable()
export class OccupantService {
  constructor(
    @InjectRepository(Occupant) private readonly repo: Repository<Occupant>,
  ) {}

  async create(data: Partial<Occupant>) {
    const occupant = this.repo.create(data);
    return this.repo.save(occupant);
  }

  async findAll() {
    return this.repo.find({ relations: ['user'] });
  }

  async findOne(id: string) {
    const occupant = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
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

  async search(dto: SearchOccupantDto) {
  const page = Number(dto.page) || 1;
  const limit = Number(dto.limit) || 10;
  const skip = (page - 1) * limit;

  const query = this.repo
    .createQueryBuilder('occupant')
    .leftJoinAndSelect('occupant.user', 'user')
    .skip(skip)
    .take(limit);

  // Search by text (flexible)
  if (dto.search) {
    query.andWhere(
      `(user.username ILIKE :search 
        OR occupant.numeroChambre ILIKE :search 
        OR user.nom ILIKE :search 
        OR user.prenom ILIKE :search)`,
      { search: `%${dto.search}%` },
    );
  }

  // Filter active/inactive
  if (dto.active !== undefined) {
    query.andWhere('user.isActive = :state', { state: dto.active === 'true' });
  }

  const [data, total] = await query.getManyAndCount();

  return {
    success: true,
    total,
    page,
    limit,
    data,
  };
}

}
