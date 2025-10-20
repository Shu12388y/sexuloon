import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  phonenumber: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  otp: string;

  @Prop({ type: Date })
  otpExpired: Date;
}

export const userSchema = SchemaFactory.createForClass(User);
