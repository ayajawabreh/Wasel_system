import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ name: 'password_hash' })
  password_hash: string;

  @Column()
  role: string;

  @Column()
  created_at: Date;
}