import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './book.entity';
import { BooksResponse } from './books.response';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private booksService: BooksService) {}
  
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
      if (mimetype !== 'application/pdf') {
        throw new Error('Только PDF-файлы разрешены');
      }
      const stream = createReadStream();
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }
      const buffer = Buffer.concat(chunks);
      const uploadDir = path.join(process.cwd(), 'uploads');
      const uniqueName = uuidv4() + path.extname(filename);
      const fullPath = path.join(uploadDir, uniqueName);
      
      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(fullPath, buffer);
      
      uploadedFile = uniqueName;
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
}
