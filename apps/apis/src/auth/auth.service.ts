import { Injectable } from '@nestjs/common';
import { UserDTO } from 'dtos/user/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userservice: UserService) {}
  async register(userdto: UserDTO) {
    const info = await this.userservice.register(userdto);
    return { message: info };
  }

  async verify(userdto: UserDTO) {
    const info = await this.userservice.verify(userdto);
    return { message: info };
  }

  async generateSiginOTP(userdto: UserDTO) {
    const info = await this.userservice.generateSigninOTP(userdto);
    return { message: info };
  }

  async signin(userdto: UserDTO) {
    const info = await this.userservice.signin(userdto);
    return { message: info };
  }
}
