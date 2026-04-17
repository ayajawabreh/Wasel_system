import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('moderationlog')
export class ModerationLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'moderator_id' })
  moderator_id!: number;

  @Column({ name: 'action_type' })
  action_type!: string;

  @Column({ name: 'target_type' })
  target_type!: string;

  @Column({ name: 'target_id' })
  target_id!: number;

  @Column()
  reason!: string;

  @Column({ name: 'created_at', type: 'datetime' })
  created_at!: Date;
}