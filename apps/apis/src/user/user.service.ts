import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'schemas/user.schema';
import { Model } from 'mongoose';
import { UserDTO } from 'dtos/user/user.dto';
import { generateOTP } from 'utils/generate-otp';
import { TwilioService } from 'src/twilio/twilio.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly twillioservice: TwilioService,
  ) {}

  async register(userdto: UserDTO) {
    try {
      const user = await this.userModel.find({
        phonenumber: userdto.phonenumber,
      });
      //   If user exists
      if (user.length != 0) {
        return {
          message: 'User already exists',
          statusCode: 401,
        };
      }
      const OTP = generateOTP();
      await this.twillioservice.sendOTP(OTP.toString(), userdto.phonenumber);
      await this.userModel.create({
        isVerified: false,
        otp: OTP.toString(),
        phonenumber: userdto.phonenumber,
      });
      return {
        message: 'User created',
        statusCode: 201,
      };
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  async verify(userdto: UserDTO) {
    try {
      // Check whether user exist or not
      const isUserVerified = await this.userModel.findOne({
        phonenumber: userdto.phonenumber,
      });
      if (!isUserVerified) {
        return {
          message: 'User not Exists',
          statusCode: 404,
        };
      }

      //   check if the user is already verified or not
      if (isUserVerified.isVerified) {
        return {
          message: 'User is already verified',
          statusCode: 401,
        };
      }

      //   Check the OTP is current or not
      if (isUserVerified.otp !== userdto.otp) {
        return {
          message: 'Wrong OTP',
          statusCode: 402,
        };
      }

      //   If it is correc then verify the user
      await this.userModel.findOneAndUpdate(
        {
          phonenumber: userdto.phonenumber,
        },
        {
          isVerified: true,
        },
      );

      return {
        message: 'Verified',
        statusCode: 200,
      };
    } catch (error) {
      throw new Error(error.toString());
    }
  }
}
