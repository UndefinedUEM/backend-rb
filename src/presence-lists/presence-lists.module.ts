import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresenceList } from './entities/presence-list.entity';
import { PresenceListsController } from './presence-lists.controller';
import { PresenceListsService } from './presence-lists.service';
import { Scout } from '../scouts/entities/scout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PresenceList, Scout])], // Adicione as duas entidades
  controllers: [PresenceListsController],
  providers: [PresenceListsService],
})
export class PresenceListsModule {}
