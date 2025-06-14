import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { FavoriteBooksService } from './favorite-books.service';
import { Book } from './book.entity';
import { BooksResponse } from './books.response';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';

@Resolver(() => Book)
export class BooksResolver {
  constructor(
    private booksService: BooksService,
    private favoriteBooksService: FavoriteBooksService,
  ) {}
  
  @Query(() => Book)
  @UseGuards(JwtAuthGuard)
  async book(@Args('id', { type: () => Int }) id: number): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Query(() => BooksResponse)
  @UseGuards(JwtAuthGuard)
  async books(
    @Args('search', { nullable: true }) search?: string,
    @Args('genre', { nullable: true }) genre?: string,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 }) skip?: number,
    @Args('take', { type: () => Int, nullable: true, defaultValue: 6 }) take?: number,
  ): Promise<BooksResponse> {
    return this.booksService.findAll(search, genre, skip, take);
  }
  
  @Mutation(() => Book)
  @UseGuards(JwtAuthGuard)
  async updateReadingProgress(
    @Args('id', { type: () => Int }) id: number,
    @Args('page', { type: () => Int }) page: number,
  ): Promise<Book> {
    return this.booksService.updateReadingProgress(id, page);
  }

  @Mutation(() => Book)
  @UseGuards(JwtAuthGuard)
  async addBook(
    @Args('title') title: string,
    @Args('author') author: string,
    @Args('genre') genre: string,
    @Args('year', { type: () => Int }) year: number,
    @Args('file', { type: () => GraphQLUpload, nullable: true }) file?: FileUpload,
  ): Promise<Book> {
    let uploadedFile: string | undefined;
    
    if (file) {
      const { createReadStream, filename, mimetype } = file;
      
      // Проверка расширения файла
      const fileExtension = path.extname(filename).toLowerCase();
      if (fileExtension !== '.pdf') {
        throw new Error('Файл должен иметь расширение .pdf');
      }
      
      // Проверка MIME-типа
      if (mimetype !== 'application/pdf') {
        throw new Error('Файл должен быть в формате PDF');
      }

      const uploadDir = path.join(process.cwd(), 'uploads');
      const uniqueName = uuidv4() + '.pdf';
      const fullPath = path.join(uploadDir, uniqueName);
      
      // Создаем директорию, если она не существует
      fs.mkdirSync(uploadDir, { recursive: true });
      
      // Создаем поток для записи файла
      const writeStream = createWriteStream(fullPath);
      
      try {
        // Получаем поток чтения из загруженного файла
        const readStream = createReadStream();
        
        // Создаем промис для обработки завершения записи
        await new Promise((resolve, reject) => {
          readStream
            .pipe(writeStream)
            .on('finish', resolve)
            .on('error', (error) => {
              // Удаляем частично записанный файл в случае ошибки
              fs.unlink(fullPath, () => {});
              reject(error);
            });
        });
        
        uploadedFile = uniqueName;
      } catch (error) {
        // Удаляем файл в случае ошибки и пробрасываем ошибку дальше
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
        throw new Error(`Ошибка при загрузке файла: ${error.message}`);
      }
    }
    
    return this.booksService.create(title, author, genre, year, uploadedFile);
  }

  @Mutation(() => Book)
  @UseGuards(JwtAuthGuard)
  async updateBook(
    @Args('id', { type: () => Int }) id: number,
    @Args('title') title: string,
    @Args('author') author: string,
    @Args('genre') genre: string,
    @Args('year', { type: () => Int }) year: number,
  ): Promise<Book> {
    return this.booksService.update(id, title, author, genre, year);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteBook(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.booksService.delete(id);
    return true;
  }

  @Mutation(() => Book)
  @UseGuards(JwtAuthGuard)
  async toggleFavorite(
    @Args('bookId', { type: () => Int }) bookId: number,
    @Context() context: any,
  ): Promise<Book> {
    const userId = context.req.user.userId;
    return this.favoriteBooksService.toggleFavorite(userId, bookId);
  }

  @Query(() => [Book])
  @UseGuards(JwtAuthGuard)
  async favoriteBooks(@Context() context: any): Promise<Book[]> {
    const userId = context.req.user.userId;
    return this.favoriteBooksService.getFavoriteBooks(userId);
  }

  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async isBookFavorite(
    @Args('bookId', { type: () => Int }) bookId: number,
    @Context() context: any,
  ): Promise<boolean> {
    const userId = context.req.user.userId;
    return this.favoriteBooksService.isBookFavorite(userId, bookId);
  }
}
