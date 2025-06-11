import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { FavoriteBook } from './favorite-book.entity';
import { BooksService } from './books.service';
import { FavoriteBooksService } from './favorite-books.service';
import { BooksResolver } from './books.resolver';
import { BooksController } from './books.controller';
import { User } from '../users/user.entity';

// Модуль для работы с книгами
@Module({
  imports: [TypeOrmModule.forFeature([Book, FavoriteBook, User])],
  providers: [BooksService, FavoriteBooksService, BooksResolver],
  controllers: [BooksController],
  exports: [BooksService, FavoriteBooksService],
})
export class BooksModule {}
