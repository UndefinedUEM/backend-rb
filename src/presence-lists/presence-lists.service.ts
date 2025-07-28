import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PresenceList } from './entities/presence-list.entity';
import { Scout } from '../scouts/entities/scout.entity';
import { ConfirmPresenceDto } from './dto/confirm-presence.dto';

@Injectable()
export class PresenceListsService {
  constructor(
    @InjectRepository(PresenceList)
    private presenceListRepository: Repository<PresenceList>,
    @InjectRepository(Scout)
    private scoutRepository: Repository<Scout>,
  ) {}

  async confirmPresence(
    confirmPresenceDto: ConfirmPresenceDto,
  ): Promise<PresenceList> {
    const { scoutIds } = confirmPresenceDto;

    const scouts = await this.scoutRepository.findBy({
      id: In(scoutIds),
    });

    if (scouts.length !== scoutIds.length) {
      throw new NotFoundException(
        'Um ou mais IDs de escoteiros não foram encontrados.',
      );
    }

    const newList = this.presenceListRepository.create({
      confirmedScouts: scouts,
    });

    return this.presenceListRepository.save(newList);
  }

  findAll(): Promise<PresenceList[]> {
    return this.presenceListRepository.find({
      relations: ['confirmedScouts'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PresenceList> {
    const list = await this.presenceListRepository.findOne({
      where: { id },
      relations: ['confirmedScouts'],
    });

    if (!list) {
      throw new NotFoundException(`Lista com ID ${id} não encontrada.`);
    }
    return list;
  }
}
