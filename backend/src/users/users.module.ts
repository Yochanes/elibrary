import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { AuthModule } from '../auth/auth.module';

// Модуль для работы с пользователями
@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule),],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
