import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../auth/dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    return this.repo.save(user);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
  }

  async search(query: any) {
  const qb = this.repo.createQueryBuilder('user');

  if (query.role) {
    qb.andWhere('user.role = :role', { role: query.role });
  }

  if (query.username) {
    qb.andWhere('LOWER(user.username) LIKE LOWER(:username)', { 
      username: `%${query.username}%` 
    });
  }

  if (query.isActive !== undefined) {
    qb.andWhere('user.isActive = :active', { active: query.isActive === 'true' });
  }

  qb.orderBy('user.createdAt', 'DESC');

  return qb.getMany();
}

}
