import { Injectable } from '@nestjs/common';
import twilio from 'twilio';

@Injectable()
export class TwilioService {
  async sendOTP(otp: string, to: string) {
    try {
      const accountsid = process.env.ACCOUNTSID;
      const authToken = process.env.AUTHTOKEN;
      const client = twilio(accountsid, authToken);
      const message = await client.messages.create({
        to: `whatsapp:${to}`,
        contentSid: 'HX229f5a04fd0510ce1b071852155d3e75',
        from: `${process.env.FROMNUMBER}`,
        contentVariables: JSON.stringify({ '1': otp }),
      });

      return message.status;
    } catch (error) {
      throw new Error(error.toString());
    }
  }
}
