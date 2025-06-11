import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteBook } from './favorite-book.entity';
import { Book } from './book.entity';
import { User } from '../users/user.entity';

@Injectable()
export class FavoriteBooksService {
  constructor(
    @InjectRepository(FavoriteBook)
    private favoriteBooksRepository: Repository<FavoriteBook>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async toggleFavorite(userId: number, bookId: number): Promise<Book> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const book = await this.booksRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new BadRequestException('Книга не найдена');
    }

    const existingFavorite = await this.favoriteBooksRepository.findOne({
      where: { user: { id: userId }, book: { id: bookId } },
    });

    if (existingFavorite) {
      await this.favoriteBooksRepository.remove(existingFavorite);
      book.isFavorite = false;
    } else {
      const favoriteBook = this.favoriteBooksRepository.create({
        user,
        book,
      });
      await this.favoriteBooksRepository.save(favoriteBook);
      book.isFavorite = true;
    }

    return book;
  }

  async getFavoriteBooks(userId: number): Promise<Book[]> {
    const favoriteBooks = await this.favoriteBooksRepository.find({
      where: { user: { id: userId } },
      relations: ['book'],
    });

    return favoriteBooks.map(fb => {
      fb.book.isFavorite = true;
      return fb.book;
    });
  }

  async isBookFavorite(userId: number, bookId: number): Promise<boolean> {
    const favorite = await this.favoriteBooksRepository.findOne({
      where: { user: { id: userId }, book: { id: bookId } },
    });
    return !!favorite;
  }
} 