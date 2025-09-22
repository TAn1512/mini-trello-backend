import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('boards/:boardId/cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) { }

  @Get()
  findAll(@Param('boardId') boardId: string) {
    return this.cardsService.findAll(boardId);
  }


  @Post()
  create(
    @Param('boardId') boardId: string,
    @Body() dto: CreateCardDto,
  ) {
    return this.cardsService.create(boardId, dto);
  }

  @Get(':id')
  findOne(
    @Param('boardId') boardId: string,
    @Param('id') id: string,
  ) {
    return this.cardsService.findOne(boardId, id);
  }

  @Get('user/:userId')
  findByUser(
    @Param('boardId') boardId: string,
    @Param('userId') userId: string,
  ) {
    return this.cardsService.findByUser(boardId, userId);
  }

  @Put(':id')
  update(
    @Param('boardId') boardId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
  ) {
    return this.cardsService.update(boardId, id, dto);
  }


  @Delete(':id')
  remove(
    @Param('boardId') boardId: string,
    @Param('id') id: string,
  ) {
    return this.cardsService.remove(boardId, id);
  }
}
