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
import { AccessCodeModule } from './access-code/access-code.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (configService.get<string>('NODE_ENV') === 'production') {
          return {
            type: 'postgres',
            url: configService.get<string>('DATABASE_URL'),
            entities: [User, Scout, PresenceList],
            synchronize: true,
            ssl: {
              rejectUnauthorized: false,
            },
          };
        } else {
          return {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: [User, Scout, PresenceList],
            synchronize: true,
          };
        }
      },
    }),
    AuthModule,
    UsersModule,
    ScoutsModule,
    PresenceListsModule,
    AccessCodeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
