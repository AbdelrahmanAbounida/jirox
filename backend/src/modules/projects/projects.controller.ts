import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserProps } from 'src/common/types/current-user';
import { FileInterceptor } from '@nestjs/platform-express';

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
  async findAllWorkspaceProjects(@Param('workspaceId') workspaceId: string) {
    return this.projectsService.findWorkspaceProjects({ workspaceId });
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch('/update/:id')
  @UseInterceptors(FileInterceptor('logo'))
  async updateProject(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserProps,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    if (logo) {
      try {
        const fileValidator = new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: /^(image\/jpeg|image\/png|image\/svg\+xml)$/,
          })
          .addMaxSizeValidator({
            maxSize: 1000000 * 10,
          })
          .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          });

        await fileValidator.transform(logo);
      } catch (error) {
        throw new BadRequestException('File validation failed.');
      }
    }
    return this.projectsService.update(id, updateProjectDto, logo, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: CurrentUserProps) {
    return this.projectsService.remove(id, user);
  }
}
