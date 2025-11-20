import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private readonly repo: Repository<Admin>,
  ) {}

  async create(data: Partial<Admin>) {
    const admin = this.repo.create(data);
    return this.repo.save(admin);
  }

  async findAll() {
    return this.repo.find({ relations: ['user'] });
  }

  async findOne(id: string) {
    const admin = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async update(id: string, data: Partial<Admin>) {
    const admin = await this.findOne(id);
    Object.assign(admin, data);
    return this.repo.save(admin);
  }

  async remove(id: string) {
    const admin = await this.findOne(id);
    return this.repo.remove(admin);
  }

  async search(filters: any) {
  const { search, access, page, limit } = filters;

  const query = this.repo
    .createQueryBuilder('admin')
    .leftJoinAndSelect('admin.user', 'user')
    .skip((page - 1) * limit)
    .take(limit);

  // 🔎 Search fields
  if (search) {
    query.andWhere(
      '(user.username ILIKE :s OR admin.nom ILIKE :s OR admin.prenom ILIKE :s OR admin.phone ILIKE :s)',
      { s: `%${search}%` },
    );
  }

  // 🎯 Filter by access level
  if (access) {
    query.andWhere('admin.access = :access', { access });
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
