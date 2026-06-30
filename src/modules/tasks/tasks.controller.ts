import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @CurrentUser() user: { userId: number },
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(user.userId, createTaskDto);
  }

  @Get()
  findAll(@CurrentUser() user: { userId: number }) {
    return this.tasksService.findAll(user.userId);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: { userId: number },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.findOne(user.userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { userId: number },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.userId, id, updateTaskDto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: { userId: number },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.remove(user.userId, id);
  }
}
