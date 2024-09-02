import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { userPayload } from './stategy/jwt.stategy';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  //REGISTER
  async register({ registerBody }: { registerBody: RegisterDto }) {
    const { email, name, password } = registerBody;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      throw new Error('User not found');
    }
    const hashPassword = await this.hashPassword({ password });

    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword,
      },
    });

    return this.authenticateUser({ userId: newUser.id });
  }
  //LOGIN
  async login({ authBody }: { authBody: LoginDto }) {
    const { email, password } = authBody;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      throw new Error('User not found');
    }
    const isPasswordValid = await this.isPasswordValid({
      password,
      hashedPassword: existingUser.password,
    });
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    return this.authenticateUser({ userId: existingUser.id });
  }

  //HASH PASSWORD
  private async hashPassword({ password }: { password: string }) {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  }

  //IS PASSWORD VALID
  private async isPasswordValid({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }) {
    const isPawwordValid = await bcrypt.compare(password, hashedPassword);
    return isPawwordValid;
  }

  private authenticateUser({ userId }: userPayload) {
    const payload: userPayload = { userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
