import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UploadAvatarInput } from './dto/upload-avatar.input';
import { FileUpload } from 'graphql-upload';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

// GraphQL резолвер для пользователей
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  
  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@Args('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }

  // Получение пользователя по email (для тестов)
  // @param email - email пользователя
  // @returns пользователь или null
  @Query(() => User, { nullable: true })
  async user(@Args('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async uploadAvatar(
    @Args('input') input: UploadAvatarInput,
    @Args('email') email: string,
  ): Promise<string> {
    const { createReadStream, filename, mimetype } = await input.file;
    
    // Проверяем тип файла
    if (!mimetype.startsWith('image/')) {
      throw new Error('Только изображения разрешены');
    }

    // Создаем директорию для аватаров, если она не существует
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Генерируем уникальное имя файла
    const fileExt = path.extname(filename);
    const uniqueName = `${uuidv4()}${fileExt}`;
    const fullPath = path.join(uploadDir, uniqueName);

    // Сохраняем файл
    const stream = createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync(fullPath, buffer);

    // Обновляем путь к аватару в базе данных
    const avatarPath = `uploads/avatars/${uniqueName}`;
    await this.usersService.updateAvatar(email, avatarPath);

    return avatarPath;
  }
}
