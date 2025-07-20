import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Adicione esta linha
  providers: [UsersService],
  exports: [UsersService], // Adicione esta linha para que outros módulos possam usar o UsersService
})
export class UsersModule {}
