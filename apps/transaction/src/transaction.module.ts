import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TwilioService } from './twilio.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule, SharedService } from '@app/shared';
import { PostgresDBModule } from '@app/shared/modules/postgresDb.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/shared/entities/user.entity';
import { TransactionEntity } from '@app/shared/entities/transaction.entity';

@Module({
  imports: [
    SharedModule,
    PostgresDBModule,
    TypeOrmModule.forFeature([UserEntity, TransactionEntity]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TwilioService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
  exports: [TwilioService],
})
export class TransactionModule {}
