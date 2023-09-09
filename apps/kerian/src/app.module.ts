import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { TransactionModule } from 'apps/transaction/src/transaction.module';
import { TwilioService } from 'apps/transaction/src/twilio.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq(
      'TRANSACTION_SERVICE',
      process.env.RABBITMQ_TRANSACTION_QUEUE,
    ),
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, TwilioService],
})
export class AppModule {}
