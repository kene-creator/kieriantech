import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MoveFundsDto {
  @IsString()
  @IsNotEmpty()
  sourceAccountId: string;

  @IsString()
  @IsNotEmpty()
  destinationAccountId: string;

  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
