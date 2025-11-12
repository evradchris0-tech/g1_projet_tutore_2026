import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository  } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwt: JwtService,
  ) {}

  async register(username: string, password: string, role: User['role']) {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.repo.create({ username, password: hashed, role });
    return this.repo.save(user);
  }

  async login(username: string, password: string) {
    const user = await this.repo.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('Utilisateur introuvable');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Mot de passe incorrect');

    return {
      token: this.jwt.sign({ id: user.id, role: user.role }),
    };
  }
}
