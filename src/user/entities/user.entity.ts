import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash' })
<<<<<<< HEAD
  password_hash: string;

  @Column()
  role: string;
=======
  password_hash!: string;

  @Column({ default: 'user' })
  role!: string;
>>>>>>> aya2

  @CreateDateColumn()
  created_at!: Date;
}