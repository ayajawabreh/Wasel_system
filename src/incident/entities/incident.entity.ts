import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Checkpoint } from '../../checkpoint/entities/checkpoint.entity';

@Entity('incident')
export class Incident {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  checkpoint_id!: number;

  @Column()
  type!: string;

  @Column()
  severity!: string;

 @Column({
  type: 'enum',
  enum: ['pending', 'resolved'],
  default: 'pending',
})
status!: string;

  @Column({ nullable: true })
  description!: string;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  latitude!: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  longitude!: number;

  @Column()
  reported_by!: number;

  @Column({ nullable: true })
  verified_by!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Checkpoint)
  @JoinColumn({ name: 'checkpoint_id' })
  checkpoint!: Checkpoint;
}