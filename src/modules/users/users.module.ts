import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from '../../database/entities/user.entity';
import { Profile } from '../../database/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}