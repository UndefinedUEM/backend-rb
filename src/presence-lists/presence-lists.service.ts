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

    // Busca no banco todos os escoteiros com os IDs fornecidos
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
    // Retorna as listas da mais recente para a mais antiga
    return this.presenceListRepository.find({
      relations: ['confirmedScouts'], // Inclui os dados dos escoteiros na resposta
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PresenceList> {
    const list = await this.presenceListRepository.findOne({
      where: { id },
      relations: ['confirmedScouts'], // Inclui os dados dos escoteiros
    });

    if (!list) {
      throw new NotFoundException(`Lista com ID ${id} não encontrada.`);
    }
    return list;
  }
}
