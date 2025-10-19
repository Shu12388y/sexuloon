import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  phonenumber: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  otp: string;
}

export const userSchema = SchemaFactory.createForClass(User);
