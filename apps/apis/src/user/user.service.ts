import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'schemas/user.schema';
import { Model } from 'mongoose';
import { UserDTO } from 'dtos/user/user.dto';
import { generateOTP } from 'utils/generate-otp';
import { TwilioService } from 'src/twilio/twilio.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly twillioservice: TwilioService,
    private readonly jwtService: JwtService,
  ) {}

  /* Register a new User */
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
      const expiredTime = new Date(Date.now() + 1 * 60 * 1000);
      await this.twillioservice.sendOTP(OTP.toString(), userdto.phonenumber);
      await this.userModel.create({
        isVerified: false,
        otp: OTP.toString(),
        phonenumber: userdto.phonenumber,
        otpExpired: expiredTime,
      });
      return {
        message: 'User created',
        statusCode: 201,
      };
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  /* Verify the new User */
  async registed(userdto: UserDTO) {
    try {
      const isUserExists = await this.userModel.findOne({
        phonenumber: userdto.phonenumber,
      });

      if (!isUserExists) {
        return {
          message: 'User not exists',
          statusCode: 404,
        };
      }

      if (isUserExists.isVerified) {
        return {
          message: 'User is already verified',
          statusCode: 200,
        };
      }

      if (isUserExists.otp !== userdto.otp) {
        return {
          message: 'Wrong OTP',
          statusCode: 402,
        };
      }

      const isOTPIsExpired = new Date(Date.now());
      if (isUserExists.otpExpired > isOTPIsExpired) {
        return {
          message: 'OTP expired',
          statusCode: 401,
        };
      }

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

  /* Verify the number send the OTP*/
  async sendingVerifyOTP(userdto: UserDTO) {
    try {
      const user = await this.userModel.find({
        phonenumber: userdto.phonenumber,
      });
      //   If user not exists
      if (user.length == 0) {
        return {
          message: 'User not exists. Please register first',
          statusCode: 404,
        };
      }

      if (user[0].isVerified) {
        return {
          message: 'Your phone number is already verified',
          statusCode: 402,
        };
      }
      const OTP = generateOTP();
      const expiredTime = new Date(Date.now() + 1 * 60 * 1000);
      await this.twillioservice.sendOTP(OTP.toString(), userdto.phonenumber);

      await this.userModel.findOneAndUpdate(
        {
          phonenumber: userdto.phonenumber,
        },
        {
          otp: OTP,
          otpExpired: expiredTime,
        },
      );

      return {
        message: 'OTP sended',
        statusCode: 201,
      };
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  /* Verify the phone number */
  async verify(userdto: UserDTO) {
    try {
      const user = await this.userModel.find({
        phonenumber: userdto.phonenumber,
      });
      //   If user exists
      if (user.length === 0) {
        return {
          message: 'User not exists',
          statusCode: 404,
        };
      }

      if (user[0].isVerified) {
        return {
          message: 'User is already verified',
          status: 200,
        };
      }

      if (user[0].otp !== userdto.otp) {
        return {
          message: 'OTP is wrong',
          statusCode: 402,
        };
      }

      const isOTPIsExpired = new Date(Date.now());
      if (isOTPIsExpired > user[0].otpExpired) {
        return {
          message: 'OTP is expired',
          statusCode: 401,
        };
      }

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

  /* Sending Signin OTP */
  async generateSigninOTP(userdto: UserDTO) {
    try {
      /* take the phonenumber as a input generate a OTP */
      const isUserExists = await this.userModel.findOne({
        phonenumber: userdto.phonenumber,
      });
      if (!isUserExists) {
        return {
          message: 'User not exists',
          statusCode: 402,
        };
      }

      // Is user is verified
      if (!isUserExists.isVerified) {
        return {
          message: 'First Verified your phonenumber',
          statusCode: 401,
        };
      }

      const OTP = generateOTP();
      await this.twillioservice.sendOTP(OTP.toString(), userdto.phonenumber);
      await this.userModel.findOneAndUpdate(
        {
          phonenumber: userdto.phonenumber,
        },
        {
          otp: OTP,
        },
      );
      return {
        message: 'OTP send Successfully',
        statusCode: 200,
      };
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  /* Signin the user  */
  async signin(userdto: UserDTO) {
    try {
      const isUserExists = await this.userModel.findOne({
        phonenumber: userdto.phonenumber,
      });

      if (!isUserExists) {
        return {
          message: 'User not exists',
          statusCode: 404,
        };
      }

      if (!isUserExists.isVerified) {
        return {
          message: 'Phonenumber is not verified',
          statusCode: 401,
        };
      }

      if (userdto.otp !== isUserExists.otp) {
        return {
          message: 'Wrong OTP',
          statusCode: 402,
        };
      }

      const token = this.jwtService.sign(isUserExists._id, {
        secret: 'secrete',
        expiresIn: '5s',
      });

      return {
        message: 'success',
        token: token,
        statusCode: 200,
      };
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  /*Resend OTP */
  async resendOTP(userdto: UserDTO, type: string) {
    try {
      if (type === 'register') {
      } else if (type === 'verify') {
      } else {
      }
    } catch (error) {
      throw new Error(error.toString());
    }
  }
}
