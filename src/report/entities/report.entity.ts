import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('report')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'category' })
  category: string;

  @Column({ name: 'latitude', type: 'double' })
  latitude: number;

  @Column({ name: 'longitude', type: 'double' })
  longitude: number;

  @Column({ name: 'timestamp', type: 'datetime' })
  timestamp: Date;

  @Column({ name: 'status' })
  status: string;
}