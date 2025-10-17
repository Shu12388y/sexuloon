import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('register')
  register() {
    return this.authservice.register();
  }

  @Post('signin')
  sigin() {
    return this.authservice.signin();
  }
}
