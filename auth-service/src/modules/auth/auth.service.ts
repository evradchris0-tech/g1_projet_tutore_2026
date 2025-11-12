import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dtos/register.dto';
import { User, UserRole } from './user.entity';
import { LoginDto } from './dtos/login.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.repo.findOne({ where: { username: dto.username } });
    if (exists) throw new ConflictException('Username already taken');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({
      username: dto.username,
      password: hashed,
      role: dto.role || UserRole.OCCUPANT,
    });
    await this.repo.save(user);

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

    const payload = { sub: user.id, username: user.username, role: user.role };
    const token = await this.jwt.signAsync(payload);

    return {
      success: true,
      data: { access_token: token, user: payload },
      message: 'Login successful',
    };
  }
}
