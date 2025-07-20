import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PresenceListsModule } from './presence-lists/presence-lists.module';
import { ScoutsModule } from './scouts/scouts.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Scout } from './scouts/entities/scout.entity';
import { PresenceList } from './presence-lists/entities/presence-list.entity';

@Module({
  imports: [
    // 1. Módulo para carregar o arquivo .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Configuração do banco de dados SQLite
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      // 3. Lista de todas as entidades que o TypeORM deve conhecer
      entities: [User, Scout, PresenceList],
      synchronize: true, // Cria/atualiza as tabelas automaticamente
    }),

    // 4. Importa todos os módulos de funcionalidades que criamos
    AuthModule,
    UsersModule,
    ScoutsModule,
    PresenceListsModule,
  ],
  // 5. Podemos remover os controllers e providers padrão, pois não os usamos mais
  controllers: [],
  providers: [],
})
export class AppModule {}
