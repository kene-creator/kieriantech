import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  destinationWalletId: string;

  @Column()
  agentId: string;

  @Column()
  pin: string;

  @Column()
  otp: string;

  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.transactions)
  user: UserEntity;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
