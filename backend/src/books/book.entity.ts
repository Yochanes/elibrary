import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { FavoriteBook } from './favorite-book.entity';

@ObjectType()
@Entity()
export class Book {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  author: string;

  @Field()
  @Column()
  genre: string;

  @Field(() => Int)
  @Column()
  year: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  pdfPath?: string;
  
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true, default: 1 })
  readingProgress?: number;

  @Field(() => [FavoriteBook], { nullable: true })
  @OneToMany(() => FavoriteBook, favoriteBook => favoriteBook.book)
  favoritedBy: FavoriteBook[];

  @Field(() => Boolean, { nullable: true })
  isFavorite?: boolean;
}
