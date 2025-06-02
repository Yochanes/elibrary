import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';

// GraphQL резолвер для пользователей
@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  // Получение пользователя по email (для тестов)
  // @param email - email пользователя
  // @returns пользователь или null
  @Query(() => User, { nullable: true })
  async user(@Args('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
