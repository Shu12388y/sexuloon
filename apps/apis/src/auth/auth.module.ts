import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { TwilioModule } from 'src/twilio/twilio.module';

@Module({
  imports: [UserModule, TwilioModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
