import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>(
          'postgresql://banco_escoteiros_user:YkbxU9HI5Bt0FzJHDlw5R6ndLQXJaakB@dpg-d2o5n1ggjchc73f68ob0-a/banco_escoteiros',
        ),
        entities: [User, Scout, PresenceList],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
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
