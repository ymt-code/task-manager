import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtSerivce: JwtService,
  ) {}

  public async register(registeDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registeDto.email },
    });

    if (existingUser) {
      throw new ConflictException('این ایمیل قبلا ثبت شده است');
    }
    const hashedPassword = await bcrypt.hash(registeDto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: registeDto.email,
        password: hashedPassword,
        name: registeDto.name,
      },
    });
    return this.generateToken(user.id, user.email);
  }

  public async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('ایمیل یا رمز اشتباه است');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user?.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('ایمیل یا رمز اشتباه است');
    }
    return this.generateToken(user.id, user.email);
  }

  private async generateToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwtSerivce.sign(payload),
    };
  }
}
