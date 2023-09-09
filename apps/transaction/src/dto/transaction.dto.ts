import { IsDecimal, IsNotEmpty, IsUUID, Length } from 'class-validator';

export class TransactionDto {
  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  destinationWalletId: string;

  @IsUUID()
  @IsNotEmpty()
  agentId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Length(4, 4)
  @IsNotEmpty()
  pin: string;

  @Length(4, 4)
  @IsNotEmpty()
  otp: string;
}
