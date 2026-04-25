import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { AlertSubscription } from '../../alert-subscription/entities/alert-subscription.entity';

@Entity('alert')
export class Alert {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  incident_id!: number;

  @Column({ nullable: true })
  subscription_id!: number;

  @ManyToOne(() => AlertSubscription)
  @JoinColumn({ name: 'subscription_id' })
  subscription!: AlertSubscription;

  @Column()
  message!: string;

  @CreateDateColumn()
  created_at!: Date;
}