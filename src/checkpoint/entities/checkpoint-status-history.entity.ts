import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Checkpoint } from './checkpoint.entity';

@Entity('checkpointstatushistory')
export class CheckpointStatusHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  checkpoint_id!: number;

  @Column()
  status!: string;

  @CreateDateColumn()
  changed_at!: Date;

  @ManyToOne(() => Checkpoint)
  @JoinColumn({ name: 'checkpoint_id' })
  checkpoint!: Checkpoint;
}