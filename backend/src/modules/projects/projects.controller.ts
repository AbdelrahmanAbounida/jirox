import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserProps } from 'src/common/types/current-user';

@Controller({
  version: '1',
  path: 'projects',
})
@ApiTags('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('/create')
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: CurrentUserProps,
  ) {
    const newProject = await this.projectsService.create(
      createProjectDto,
      user,
    );
    console.log({ newProject });
    return newProject;
  }

  @Get('/all/:workspaceId')
  async findAll(@Param('workspaceId') workspaceId: string) {
    return this.projectsService.findAll({ workspaceId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
