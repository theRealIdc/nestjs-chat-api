import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { ReqestWithUser } from './stategy/jwt.stategy';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}
  @Post('login')
  async login(@Body() authBody: LoginDto) {
    return await this.authService.login({ authBody });
  }
  @Post('register')
  async register(@Body() registerBody: RegisterDto) {
    return await this.authService.register({ registerBody });
  }

  @UseGuards(JwtAuthGuard)
  @Get('authenticate')
  async authenticate(@Request() req: ReqestWithUser) {
    return await this.userService.getUser({ userId: req.user.userId });
  }
}
