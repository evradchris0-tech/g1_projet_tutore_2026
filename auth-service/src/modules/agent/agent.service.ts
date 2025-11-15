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
}
