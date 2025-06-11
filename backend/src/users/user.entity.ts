import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { FavoriteBook } from '../books/favorite-book.entity';

// Сущность пользователя для TypeORM и GraphQL
@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field()
  @Column()
  password: string; // Хранится в хешированном виде

  @Field({ nullable: true })
  @Column({ nullable: true })
  resetToken: string; // Токен для сброса пароля

  @Field({ nullable: true })
  @Column({ nullable: true })
  resetTokenExpiry: Date; // Срок действия токена
  
  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar: string; // Путь к аватару пользователя

  @Field(() => [FavoriteBook], { nullable: true })
  @OneToMany(() => FavoriteBook, favoriteBook => favoriteBook.user)
  favoriteBooks: FavoriteBook[];
}
