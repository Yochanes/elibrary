import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

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
}
