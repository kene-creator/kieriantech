import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
