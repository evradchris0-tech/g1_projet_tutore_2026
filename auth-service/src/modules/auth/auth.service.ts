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
import { AccessLevel, Admin } from '../admin/admin.entity';
import { Agent } from '../agent/agent.entity';
import { Occupant } from '../occupant/occupant.entity';

type BulkRow = {
  username: string;
  password?: string;
  role: UserRole;
  nom?: string;
  prenom?: string;
  numeroChambre?: string;
  phone?: string;
  speciality?: string;
  access?: AccessLevel;
  IsSupervisor?: string;
  tempPassword?: string;
};

type BulkResult =
  | { row: string; status: 'OK'; user: { success: boolean; data: { id: string; username: string; role: UserRole }; message: string } }
  | { row: string; status: 'ERROR'; error: string };

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
  // 1️⃣ OCCUPANT LOGIN (numeroChambre + tempPassword)
  if (dto.numeroChambre && dto.tempPassword) {
    const occupant = await this.occupantRepo.findOne({
      where: { numeroChambre: dto.numeroChambre },
      relations: ['user'],
    });

    if (!occupant) {
      throw new UnauthorizedException('Invalid room number');
    }

    // tempPassword is stored in Occupant entity (not hashed)
    if (occupant.tempPassword !== dto.tempPassword) {
      throw new UnauthorizedException('Invalid temporary password');
    }

    const payload = {
      id: occupant.user.id,
      username: occupant.user.username,
      role: UserRole.OCCUPANT,
      numeroChambre: occupant.numeroChambre,
    };

    const token = await this.jwt.signAsync(payload);

    return {
      success: true,
      data: { access_token: token, user: payload },
      message: 'Occupant login successful',
    };
  }

  // 2️⃣ ADMIN or AGENT LOGIN (username + password)
  if (!dto.username || !dto.password) {
    throw new UnauthorizedException(
      'For admin/agent, username and password are required',
    );
  }

  const user = await this.repo.findOne({ where: { username: dto.username } });

  if (!user) throw new UnauthorizedException('Invalid username');

  const valid = await bcrypt.compare(dto.password, user.password);

  if (!valid) throw new UnauthorizedException('Invalid password');

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  const token = await this.jwt.signAsync(payload);

  return {
    success: true,
    data: { access_token: token, user: payload },
    message: 'Login successful',
  };
}

  async importBulkUsers(rows: BulkRow[]) {
    const results: BulkResult[] = [];

    for (const row of rows) {
      try {
        const dto: RegisterDto = {
          username: row.username,
          password: row.password ?? 'default123',
          role: row.role,
          nom: row.nom,
          prenom: row.prenom,
          numeroChambre: row.numeroChambre,
          phone: row.phone,
          speciality: row.speciality,
          access: row.access,
          IsSupervisor: row.IsSupervisor === 'true',
        };

        const user = await this.register(dto);
        results.push({ row: row.username, status: 'OK', user });
      } catch (err: any) {
        results.push({ row: row.username, status: 'ERROR', error: err.message });
      }
    }

    return {
      message: 'Bulk import completed',
      results,
    };
  }
    
}
