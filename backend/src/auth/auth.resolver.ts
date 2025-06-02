import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';

// GraphQL резолвер для авторизации
@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // Регистрация
  @Mutation(() => String)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    return this.authService.register(email, password);
  }

  // Авторизация
  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    return this.authService.login(email, password);
  }

  // Запрос восстановления пароля
  @Mutation(() => String)
  async requestPasswordReset(@Args('email') email: string): Promise<string> {
    return this.authService.requestPasswordReset(email);
  }

  // Сброс пароля
  @Mutation(() => String)
  async resetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ): Promise<string> {
    return this.authService.resetPassword(token, newPassword);
  }
}
