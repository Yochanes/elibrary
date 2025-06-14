import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

// Сервис для работы с пользователями
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  
  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // Создание пользователя
  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ email, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  // Поиск пользователя по email
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // Поиск пользователя по токену сброса
  async findByResetToken(resetToken: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { resetToken } });
  }

  // Обновление пользователя
  async update(id: number, data: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, data);
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateAvatar(email: string, avatarPath: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    user.avatar = avatarPath;
    return this.usersRepository.save(user);
  }

  // Обновление роли пользователя (только для админов)
  async updateUserRole(userId: number, newRole: UserRole): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    
    user.role = newRole;
    return this.usersRepository.save(user);
  }

  // Проверка, является ли пользователь админом
  async isAdmin(userId: number): Promise<boolean> {
    const user = await this.findOne(userId);
    return user?.role === UserRole.ADMIN;
  }

  // Получение всех пользователей (только для админов)
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
