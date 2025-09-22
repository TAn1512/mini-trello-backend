import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) { }

  @Post()
  create(@Req() req, @Body() dto: CreateBoardDto) {
    return this.boardsService.create(req.user.email, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.boardsService.findAll(req.user.email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBoardDto) {
    return this.boardsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardsService.remove(id);
  }

  @Post(':boardId/invite')
  inviteMember(@Param('boardId') boardId: string, @Req() req, @Body() dto: any) {
    return this.boardsService.inviteMember(boardId, req.user.email || "github_" + req.user.username, dto);
  }

  @Post(':boardId/respond-invite')
  respondToInvite(@Param('boardId') boardId: string, @Req() req, @Body() dto: any) {
    return this.boardsService.respondToInvite(boardId, req.user.email || "github_" + req.user.username, dto);
  }
}
