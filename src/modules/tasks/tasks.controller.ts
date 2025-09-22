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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('boards/:boardId/cards/:cardId/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Get()
  findAll(
    @Param('boardId') boardId: string,
    @Param('cardId') cardId: string,
  ) {
    return this.tasksService.findAll(boardId, cardId);
  }

  @Post()
  create(
    @Param('boardId') boardId: string,
    @Param('cardId') cardId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(boardId, cardId, dto);
  }

  @Get(':id')
  findOne(
    @Param('boardId') boardId: string,
    @Param('cardId') cardId: string,
    @Param('id') id: string,
  ) {
    return this.tasksService.findOne(boardId, cardId, id);
  }

  @Put(':id')
  update(
    @Param('boardId') boardId: string,
    @Param('cardId') cardId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(boardId, cardId, id, dto);
  }

  @Delete(':id')
  remove(
    @Param('boardId') boardId: string,
    @Param('cardId') cardId: string,
    @Param('id') id: string,
  ) {
    return this.tasksService.remove(boardId, cardId, id);
  }

  @Post(":taskId/assign")
  assignMember(
    @Param("boardId") boardId: string,
    @Param("cardId") cardId: string,
    @Param("taskId") taskId: string,
    @Body("memberId") memberId: string,
  ) {
    return this.tasksService.assignMember(boardId, cardId, taskId, memberId);
  }

  @Get(":taskId/assign")
  getAssignees(
    @Param("boardId") boardId: string,
    @Param("cardId") cardId: string,
    @Param("taskId") taskId: string,
  ) {
    return this.tasksService.getAssignees(boardId, cardId, taskId);
  }

  @Delete(":taskId/assign/:memberId")
  removeAssignee(
    @Param("boardId") boardId: string,
    @Param("cardId") cardId: string,
    @Param("taskId") taskId: string,
    @Param("memberId") memberId: string,
  ) {
    return this.tasksService.removeAssignee(boardId, cardId, taskId, memberId);
  }
}
