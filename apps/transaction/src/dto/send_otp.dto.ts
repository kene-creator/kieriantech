import { IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  transactionId: string;
}
