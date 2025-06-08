import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

// GraphQL резолвер для пользователей
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  
  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: any) {
    if (!user || !user.id) {
      return null;
    }
    return this.usersService.findOne(user.id);
  }

  // Получение пользователя по email (для тестов)
  // @param email - email пользователя
  // @returns пользователь или null
  @Query(() => User, { nullable: true })
  async user(@Args('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
