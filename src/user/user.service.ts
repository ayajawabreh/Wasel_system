
/*
<<<<<<< HEAD
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
=======
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
>>>>>>> 45aef09 (my work before pull)

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
<<<<<<< HEAD
    private readonly userRepository: Repository<User>,
  ) {}

  async create(name: string, email: string, password: string, role = 'user') {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        name,
        email,
        password_hash: hashedPassword,
        role,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, data: Partial<{ name: string; email: string; password: string; role: string }>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
      data['password_hash'] = data.password;
      delete data.password;
    }
    await this.userRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return { deleted: true };
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
=======
    private userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  create(data: any) {
    return this.userRepo.save(data);
  }
>>>>>>> 45aef09 (my work before pull)
}

*/

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(name: string, email: string, password: string, role = 'customer')  {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        name,
        email,
        password_hash: hashedPassword,
        role,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, data: Partial<{ name: string; email: string; password: string; role: string }>) {
    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 10);
      data['password_hash'] = hashed;
      delete data.password;
    }
    await this.userRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return { deleted: true };
  }

  async findByEmail(email: string) {
  return this.userRepository
    .createQueryBuilder('user')
    .addSelect('user.password_hash')
    .where('user.email = :email', { email })
    .getOne();
}
}