import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

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

  @Field()
  @Column()
  password: string; // Хранится в хешированном виде

  @Field({ nullable: true })
  @Column({ nullable: true })
  resetToken: string; // Токен для сброса пароля

  @Field({ nullable: true })
  @Column({ nullable: true })
  resetTokenExpiry: Date; // Срок действия токена
}
