import { TransactionEntity } from '@app/shared/entities/transaction.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoveFundsDto, TransactionDto, VerifyOtpDto } from './dto';
import { SendOtpDto } from './dto/send_otp.dto';
import { TwilioService } from './twilio.service';
import { AuditLogEntity } from '@app/shared/entities/audit-log.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
    private readonly twilioService: TwilioService,
  ) {}

  async createTransaction(dto: TransactionDto): Promise<TransactionEntity> {
    const newTransaction = this.transactionRepository.create({
      amount: dto.amount,
      destinationWalletId: dto.destinationWalletId,
      agentId: dto.agentId,
      pin: dto.pin,
      otp: dto.otp,
      userId: dto.userId,
    });
    await this.transactionRepository.save(newTransaction);
    return newTransaction;
  }

  async listTransactions(userId: string): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async getTransaction(transactionId: string): Promise<TransactionEntity> {
    return this.transactionRepository.findOne({
      where: {
        id: transactionId,
      },
    });
  }

  async sendOtp(sendOtpDto: SendOtpDto): Promise<void> {
    try {
      const { transactionId } = sendOtpDto;
      const transaction = await this.transactionRepository.findOne({
        where: {
          id: transactionId,
        },
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }
      await this.twilioService.sendOtp(sendOtpDto.phoneNumber, transaction.otp);

      return;
    } catch (error) {
      throw new BadRequestException('Failed to send OTP');
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<void> {
    try {
      const { transactionId } = verifyOtpDto;
      const transaction = await this.transactionRepository.findOne({
        where: {
          id: transactionId,
        },
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      if (transaction.otp !== verifyOtpDto.otp) {
        throw new BadRequestException('Invalid OTP');
      }
    } catch (error) {
      throw new BadRequestException('Failed to verify OTP');
    }
  }

  async auditLogs(dto: MoveFundsDto): Promise<void> {
    const debitLog = this.auditLogRepository.create({
      userId: dto.destinationAccountId,
      transactionId: dto.transactionId,
      transactionType: 'debit',
      amount: dto.amount,
    });
    await this.auditLogRepository.save(debitLog);

    const creditLog = this.auditLogRepository.create({
      userId: dto.sourceAccountId,
      transactionId: dto.transactionId,
      transactionType: 'credit',
      amount: dto.amount,
    });
    await this.auditLogRepository.save(creditLog);
  }
}
