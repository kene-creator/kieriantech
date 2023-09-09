import {
  Controller,
  Post,
  Body,
  Get,
  Inject,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TwilioService } from 'apps/transaction/src/twilio.service';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(
    @Inject('TRANSACTION_SERVICE') private transactionService: ClientProxy,
    private readonly twilioService: TwilioService,
    private readonly appService: AppService,
  ) {}

  @Post('create-transaction')
  async createTransaction(
    @Body('amount') amount: number,
    @Body('destinationWalletId') destinationWalletId: string,
    @Body('agentId') agentId: string,
    @Body('userId') userId: string,
    @Body('pin') pin: string,
  ) {
    const otp = this.appService.generateNumericOtp(4);
    return this.transactionService.send(
      { cmd: 'create-transaction' },
      {
        amount,
        destinationWalletId,
        agentId,
        userId,
        pin,
        otp,
      },
    );
  }

  @Get('list-transactions')
  async listTransactions(@Body('userId') userId: string) {
    return this.transactionService.send(
      { cmd: 'list-transactions' },
      {
        userId,
      },
    );
  }

  @Get('get/:transactionId')
  async getTransaction(@Param('transactionId') transactionId: string) {
    return this.transactionService.send(
      { cmd: 'get-transaction' },
      {
        transactionId,
      },
    );
  }

  @Post('send-otp')
  async sendOtp(
    @Body('phoneNumber') phoneNumber: string,
    @Body('transactionId') transactionId: string,
  ) {
    // const otp = this.appService.generateNumericOtp(4);

    // try {
    //   await this.twilioService.sendOtp(phoneNumber, otp);
    //   return { message: 'OTP sent successfully' };
    // } catch (error) {
    //   throw new BadRequestException('Failed to send OTP');
    // }
    return this.transactionService.send(
      { cmd: 'send-otp' },
      {
        phoneNumber,
        transactionId,
      },
    );
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('transactionId') transactionId: string,
    @Body('otp') otp: string,
  ) {
    if (!transactionId || !otp) {
      throw new BadRequestException('Invalid OTP or User ID');
    }

    return this.transactionService.send(
      { cmd: 'verify-otp' },
      {
        transactionId,
        otp,
      },
    );
  }

  @Post('audit')
  async audit(
    @Body('sourceAccountId') sourceAccountId: string,
    @Body('destinationAccountId') destinationAccountId: string,
    @Body('transactionId') transactionId: string,
    @Body('amount') amount: number,
  ) {
    return this.transactionService.send(
      { cmd: 'audit-logs' },
      {
        sourceAccountId,
        destinationAccountId,
        transactionId,
        amount,
      },
    );
  }
}
