import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scout } from './entities/scout.entity';
import { ScoutsController } from './scouts.controller';
import { ScoutsService } from './scouts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Scout])], // Adicione esta linha
  controllers: [ScoutsController],
  providers: [ScoutsService],
})
export class ScoutsModule {}
