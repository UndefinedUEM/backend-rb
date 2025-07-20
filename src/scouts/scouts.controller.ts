import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ScoutsService } from './scouts.service';
import { CreateScoutDto } from './dto/create-scout.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('escoteiros')
export class ScoutsController {
  constructor(private readonly scoutsService: ScoutsService) {}

  @Post('cadastro')
  create(@Body() createScoutDto: CreateScoutDto) {
    return this.scoutsService.create(createScoutDto);
  }

  @Get()
  findAll() {
    return this.scoutsService.findAll();
  }
}
