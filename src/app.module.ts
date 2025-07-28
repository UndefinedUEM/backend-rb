import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ScoutsModule } from './scouts/scouts.module';
import { PresenceListsModule } from './presence-lists/presence-lists.module';
import { User } from './users/entities/user.entity';
import { Scout } from './scouts/entities/scout.entity';
import { PresenceList } from './presence-lists/entities/presence-list.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Scout, PresenceList],
      synchronize: true,
    }),

    AuthModule,
    UsersModule,
    ScoutsModule,
    PresenceListsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
