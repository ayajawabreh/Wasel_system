import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('area')
export class Area {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude!: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude!: number;

  @Column('decimal', { name: 'radius_km', precision: 5, scale: 2, default: 1 })
  radiusKm!: number;

  @Column({ name: 'penalty_minutes', type: 'int', default: 5 })
  penaltyMinutes!: number;

  @Column('decimal', {
    name: 'penalty_distance_km',
    precision: 5,
    scale: 2,
    default: 1,
  })
  penaltyDistanceKm!: number;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;
}