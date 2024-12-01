import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { CurrentUserProps } from 'src/common/types/current-user';
import { ApiTags } from '@nestjs/swagger';
import { KanbanService } from './kanban.services';

@Controller({
  path: 'tasks',
  version: '1',
})
@ApiTags('Tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly kanbanService: KanbanService,
  ) {}

  @Post('/create')
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get('/project-tasks/:projectId')
  findAllProjectTasks(@Param('projectId') projectId: string) {
    return this.tasksService.getProjectTasks({ projectId });
  }

  @Get(':id')
  async findTask(@Param('id') id: string) {
    return this.tasksService.findOneWithAssigneeEmail(id);
  }

  @Patch('/update/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: CurrentUserProps,
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  async removeTask(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserProps,
  ) {
    return this.tasksService.remove(id, user);
  }

  /** ********* Kanbna Routes ************* */

  // TODO:: update col tasks (in project or workspace)
}
