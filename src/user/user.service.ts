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

  async create(name: string, email: string, password_hash: string, role = 'user') {
    try {
      const user = this.userRepository.create({
        name,
        email,
        password_hash,
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
    const updateData: any = { ...data };

    if (updateData.password) {
      updateData.password_hash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }

    await this.userRepository.update(id, updateData);
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
}