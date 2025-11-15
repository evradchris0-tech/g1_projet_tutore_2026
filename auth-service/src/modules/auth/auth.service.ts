import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dtos/register.dto';
import { User, UserRole } from '../users/user.entity';
import { LoginDto } from './dtos/login.dto';
import { Admin } from '../admin/admin.entity';
import { Agent } from '../agent/agent.entity';
import { Occupant } from '../occupant/occupant.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    @InjectRepository(Agent) private readonly agentRepo: Repository<Agent>,
    @InjectRepository(Occupant)
    private readonly occupantRepo: Repository<Occupant>,

    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.repo.findOne({
      where: { username: dto.username },
    });
    if (exists) throw new ConflictException('Username already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({
      username: dto.username,
      password: hashed,
      role: dto.role,
    });
    const savedUser = await this.repo.save(user);

    // Selon le rôle, créer une entité spécifique
    switch (dto.role) {
      case UserRole.ADMIN:
        await this.adminRepo.save({
          user: savedUser,
          access: dto.access,
          nom: dto.nom,
          prenom: dto.prenom,
          phone: dto.phone,
        });
        break;
      case UserRole.AGENT:
        await this.agentRepo.save({
          user: savedUser,
          nom: dto.nom,
          prenom: dto.prenom,
          phone: dto.phone,
          speciality: dto.speciality,
          IsSupervisor: dto.IsSupervisor ?? false,
        });
        break;
      case UserRole.OCCUPANT:
        await this.occupantRepo.save({
          user: savedUser,
          numeroChambre: dto.numeroChambre,
          tempPassword: dto.tempPassword,
        });
        break;
    }

    return {
      success: true,
      data: { id: user.id, username: user.username, role: user.role },
      message: `User successfully registered as ${user.role}`,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.repo.findOne({ where: { username: dto.username } });
    if (!user) throw new UnauthorizedException('Invalid username');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid password');

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = await this.jwt.signAsync(payload);

    return {
      success: true,
      data: { access_token: token, user: payload },
      message: 'Login successful',
    };
  }
}
