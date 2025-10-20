import { Controller, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body } from '@nestjs/common';
import { UserDTO } from 'dtos/user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  /* Register new user */
  @Post('register')
  register(@Body() userdto: UserDTO) {
    return this.authservice.register(userdto);
  }

  /* Verify user */
  @Put('verify')
  verify(@Body() userdto: UserDTO) {
    return this.authservice.verify(userdto);
  }

  /*Resend the OTP */
  @Put('resend')
  resendOTP(@Body() userdto: UserDTO) {
    return this.authservice.verify(userdto);
  }

  /* SignIN OTP */
  @Put('signinotp')
  siginOTP(@Body() userdto: UserDTO) {
    return this.authservice.generateSiginOTP(userdto);
  }

  /*Sigin User */
  @Post('signin')
  sigin(@Body() userdto: UserDTO) {
    return this.authservice.signin(userdto);
  }
}
