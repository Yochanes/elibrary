import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { BooksController } from './books.controller';

// Модуль для работы с книгами
@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  providers: [BooksService, BooksResolver],
  controllers: [BooksController],
  exports: [BooksService],
})
export class BooksModule {}
