import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'schemas/user.schema';
import { TwilioModule } from 'src/twilio/twilio.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    TwilioModule,
    JwtModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
