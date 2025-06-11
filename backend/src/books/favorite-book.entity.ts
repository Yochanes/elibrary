import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { Book } from './book.entity';

@ObjectType()
@Entity()
export class FavoriteBook {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, user => user.favoriteBooks)
  user: User;

  @Field(() => Book)
  @ManyToOne(() => Book, book => book.favoritedBy)
  book: Book;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
} 