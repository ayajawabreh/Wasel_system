import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reportvote')
export class ReportVote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  report_id: number;

  @Column()
  vote_type: string; // 'up' or 'down'
}