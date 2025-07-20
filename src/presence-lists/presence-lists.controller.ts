import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PresenceListsService } from './presence-lists.service';
import { ConfirmPresenceDto } from './dto/confirm-presence.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('listas')
export class PresenceListsController {
  constructor(private readonly presenceListsService: PresenceListsService) {}

  // MUDANÇA AQUI:
  @Post('confirmar')
  confirmPresence(@Body() confirmPresenceDto: ConfirmPresenceDto) {
    return this.presenceListsService.confirmPresence(confirmPresenceDto);
  }

  @Get()
  findAll() {
    return this.presenceListsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.presenceListsService.findOne(id);
  }
}
