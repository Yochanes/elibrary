import { Injectable, ConflictException, UnauthorizedException, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';

// Сервис для авторизации
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Регистрация
  async register(email: string, password: string): Promise<string> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email уже занят');
    }
    const user = await this.usersService.create(email, password);
    const payload = { userId: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  // Авторизация
  async login(email: string, password: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Неверный email или пароль');
    }
    const payload = { userId: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  // Валидация пользователя по JWT
  async validateUser(payload: any): Promise<any> {
    return this.usersService.findByEmail(payload.email);
  }

  // Запрос восстановления пароля
  async requestPasswordReset(email: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Пользователь с таким email не найден');
    }

    // Генерация токена и срока действия
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 час
    await this.usersService.update(user.id, { resetToken, resetTokenExpiry });

    // Настройка Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true для порта 465, false для 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false, // Для тестирования
        minVersion: 'TLSv1.2',
      },
      family: 4, // Принудительно использовать IPv4
    });

    // Формирование ссылки
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Отправка email
    try {
      await transporter.sendMail({
        from: `"Auth App" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Сброс пароля',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #333;">Сброс пароля</h2>
            <p>Здравствуйте!</p>
            <p>Вы запросили сброс пароля. Нажмите на кнопку ниже, чтобы установить новый пароль:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Сбросить пароль</a>
            <p>Ссылка действительна в течение 1 часа.</p>
            <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
            <p>С уважением,<br>Команда Auth App</p>
          </div>
        `,
      });
      return 'Ссылка для сброса пароля отправлена на email';
    } catch (error) {
      console.error('Ошибка отправки email:', error);
      throw new InternalServerErrorException('Не удалось отправить email');
    }
  }

  // Сброс пароля
  async resetPassword(token: string, newPassword: string): Promise<string> {
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new BadRequestException('Недействительный или истекший токен');
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Токен истек');
    }

    // Обновление пароля
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return 'Пароль успешно изменен';
  }
}
