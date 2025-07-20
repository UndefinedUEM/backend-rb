import { Injectable, OnModuleInit, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scout } from './entities/scout.entity';
import { CreateScoutDto } from './dto/create-scout.dto';
import { initialScouts } from './data/initial-scouts.data';

@Injectable()
export class ScoutsService implements OnModuleInit {
  constructor(
    @InjectRepository(Scout)
    private scoutsRepository: Repository<Scout>,
  ) {}

  async onModuleInit() {
    const count = await this.scoutsRepository.count();
    if (count === 0) {
      console.log(
        'Populando banco de dados de escoteiros com a lista do arquivo...',
      );
      await this.scoutsRepository.save(initialScouts);
    }
  }

  async create(createScoutDto: CreateScoutDto): Promise<Scout> {
    const existingScout = await this.scoutsRepository.findOneBy({
      id: createScoutDto.id,
    });

    if (existingScout) {
      throw new ConflictException('Já existe um escoteiro com este ID.');
    }

    const scout = this.scoutsRepository.create(createScoutDto);
    return this.scoutsRepository.save(scout);
  }

  findAll(): Promise<Scout[]> {
    return this.scoutsRepository.find({ order: { name: 'ASC' } });
  }
}
