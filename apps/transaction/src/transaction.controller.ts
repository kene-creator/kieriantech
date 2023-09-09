import { Controller, Inject } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SharedService } from '@app/shared';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { TransactionDto, SendOtpDto, VerifyOtpDto, MoveFundsDto } from './dto';

@Controller()
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'create-transaction' })
  async getUser(
    @Ctx() context: RmqContext,
    @Payload() transaction: TransactionDto,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.transactionService.createTransaction(transaction);
  }

  @MessagePattern({ cmd: 'list-transactions' })
  async listTransactions(
    @Ctx() context: RmqContext,
    @Payload() userId: string,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.transactionService.listTransactions(userId);
  }

  @MessagePattern({ cmd: 'get-transaction' })
  async getTransaction(
    @Ctx() context: RmqContext,
    @Payload() transactionId: string,
  ) {
    this.sharedService.acknowledgeMessage(context);
    return await this.transactionService.getTransaction(transactionId);
  }

  @MessagePattern('send-otp')
  async sendOtp(@Ctx() context: RmqContext, @Payload() sendOtpDto: SendOtpDto) {
    this.sharedService.acknowledgeMessage(context);

    await this.transactionService.sendOtp(sendOtpDto);

    return { message: 'OTP sent successfully' };
  }

  @MessagePattern('verify-otp')
  async verifyOtp(
    @Ctx() context: RmqContext,
    @Payload() verifyOtpDto: VerifyOtpDto,
  ) {
    this.sharedService.acknowledgeMessage(context);

    await this.transactionService.verifyOtp(verifyOtpDto);

    return { message: 'OTP verified successfully' };
  }

  @MessagePattern('audit-logs')
  async auditLogs(@Ctx() context: RmqContext, @Payload() data: MoveFundsDto) {
    this.sharedService.acknowledgeMessage(context);

    await this.transactionService.auditLogs(data);

    return { message: 'Funds transferred successfully' };
  }
}
