import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async create(
    name: string,
    email: string,
    password: string,
    role = 'user',
  ) {
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

  async update(
    id: number,
    data: Partial<{
      name: string;
      email: string;
      password: string;
      role: string;
    }>,
  ) {
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      (data as any).password_hash = hashedPassword;
      delete data.password;
    }

    await this.userRepository.update(id, data);
    return this.findOne(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'role', 'password_hash'],
    });
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return { deleted: true };
  }
}