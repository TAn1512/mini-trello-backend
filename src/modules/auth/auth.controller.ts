import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signup/verify')
  async verifySignup(@Body() dto: VerifyCodeDto) {
    return this.authService.verifySignup(dto);
  }

  @Post('signin')
  async signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto.email);
  }

  @Post('signin/verify')
  async verifySignin(@Body() dto: VerifyCodeDto) {
    return this.authService.verifySignin(dto.email, dto.verificationCode);
  }

  @Post('github')
  async githubLogin(@Body('code') code: string) {
    return this.authService.githubLogin(code);
  }
}
