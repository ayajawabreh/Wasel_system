import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user') // مهم عشان يربط مع الجدول الموجود
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ name: 'password_hash' })
  password: string;

  role: string;

  @Column()
  created_at: Date;
}