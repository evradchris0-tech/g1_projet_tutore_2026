import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './agent.entity';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent) private readonly repo: Repository<Agent>,
  ) {}

  async create(data: Partial<Agent>) {
    const agent = this.repo.create(data);
    return this.repo.save(agent);
  }

  async findAll() {
    return this.repo.find({ relations: ['user'] });
  }

  async findOne(id: string) {
    const agent = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async update(id: string, data: Partial<Agent>) {
    const agent = await this.findOne(id);
    Object.assign(agent, data);
    return this.repo.save(agent);
  }

  async remove(id: string) {
    const agent = await this.findOne(id);
    return this.repo.remove(agent);
  }

  async searchAgents(filters: any) {
    const {
      search,
      speciality,
      supervisor,
      isActive,
      page,
      limit,
      sortBy,
      order,
    } = filters;

    const qb = this.repo
      .createQueryBuilder('agent')
      .leftJoinAndSelect('agent.user', 'user');

    // 🔍 Search
    if (search) {
      qb.andWhere(
        `(LOWER(agent.nom) LIKE LOWER(:search)
        OR LOWER(agent.prenom) LIKE LOWER(:search)
        OR LOWER(agent.speciality) LIKE LOWER(:search)
        OR LOWER(user.username) LIKE LOWER(:search)
        OR agent.phone LIKE :search)`,
        { search: `%${search}%` },
      );
    }

    // 🎯 Filter: speciality
    if (speciality) qb.andWhere('agent.speciality = :speciality', { speciality });

    // 🎯 Filter: supervisor
    if (supervisor !== undefined)
      qb.andWhere('agent.IsSupervisor = :supervisor', {
        supervisor: supervisor === 'true',
      });

    // 🎯 Filter: isActive (from User relation)
    if (isActive !== undefined)
      qb.andWhere('user.isActive = :isActive', {
        isActive: isActive === 'true',
      });

    // 📄 Pagination
    qb.skip((page - 1) * limit).take(limit);

    // 🔽 Sorting
    qb.orderBy(`agent.${sortBy}`, order);

    const [data, total] = await qb.getManyAndCount();

    return {
      success: true,
      message: 'Agents fetched successfully',
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
