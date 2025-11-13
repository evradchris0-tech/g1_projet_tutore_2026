import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(Admin) private readonly repo: Repository<Admin>) {}

  async create(data: Partial<Admin>) {
    const admin = this.repo.create(data);
    return this.repo.save(admin);
  }

  async findAll() {
    return this.repo.find({ relations: ['user'] });
  }

  async findOne(id: string) {
    const admin = await this.repo.findOne({ where: { id }, relations: ['user'] });
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
}
