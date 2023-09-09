// twilio.service.ts
import * as Twilio from 'twilio';
import twilioConfig from '../../../twilio.config';

const client = Twilio(twilioConfig.accountSid, twilioConfig.authToken);

export class TwilioService {
  async sendOtp(phoneNumber: string, otp: string): Promise<void> {
    try {
      await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: twilioConfig.phoneNumber,
        to: phoneNumber,
      });
    } catch (error) {
      throw new Error('Failed to send OTP');
    }
  }
}
