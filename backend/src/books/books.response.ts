import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Book } from './book.entity';

// GraphQL-объект для ответа с пагинацией
@ObjectType()
export class BooksResponse {
  @Field(() => [Book])
  books: Book[];

  @Field(() => Int)
  total: number;
}
