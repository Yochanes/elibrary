import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

// Сервис для работы с книгами
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}
  
  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) {
      throw new BadRequestException('Книга не найдена');
    }
    return book;
  }
  
  async updateReadingProgress(id: number, page: number): Promise<Book> {
    const book = await this.findOne(id);
    book.readingProgress = page;
    return this.booksRepository.save(book);
  }    

  async findAll(search?: string, genre?: string, skip = 0, take = 6): Promise<{ books: Book[]; total: number }> {
    let query = this.booksRepository.createQueryBuilder('book');

    if (search) {
      query = query.where('LOWER(book.title) LIKE LOWER(:search) OR LOWER(book.author) LIKE LOWER(:search)', { 
        search: `%${search}%` 
      });
    }

    if (genre) {
      query = query.andWhere('LOWER(book.genre) = LOWER(:genre)', { genre });
    }

    const total = await query.getCount();
    const books = await query.skip(skip).take(take).getMany();

    return { books, total };
  }

  async create(title: string, author: string, genre: string, year: number, fileId?: string): Promise<Book> {
    let pdfPath: string | undefined;

    if (fileId) {
      const fullPath = join(process.cwd(), 'uploads', fileId);
      if (!existsSync(fullPath)) {
        throw new BadRequestException('Загруженный файл не найден');
      }
      pdfPath = `uploads/${fileId}`;
    }

    const book = this.booksRepository.create({ 
      title, 
      author, 
      genre, 
      year, 
      pdfPath 
    });
    
    return this.booksRepository.save(book);
  }

  async update(id: number, title: string, author: string, genre: string, year: number): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Книга с ID ${id} не найдена`);
    }
    
    book.title = title;
    book.author = author;
    book.genre = genre;
    book.year = year;
    
    return this.booksRepository.save(book);
  }

  async delete(id: number): Promise<void> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Книга с ID ${id} не найдена`);
    }

    // Delete associated file if exists
    if (book.pdfPath) {
      const fullPath = join(process.cwd(), book.pdfPath);
      if (existsSync(fullPath)) {
        try {
          unlinkSync(fullPath);
        } catch (error) {
          console.warn('Не удалось удалить файл:', error);
        }
      }
    }

    await this.booksRepository.delete(id);
  }
}
