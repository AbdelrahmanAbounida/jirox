import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CurrentUserProps } from 'src/common/types/current-user';

@Controller({
  version: '1',
  path: 'workspaces',
})
@ApiTags('Workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post('/create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('logo'))
  create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^(image\/jpeg|image\/png|image\/svg\+xml)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1000000 * 10,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    logo: Express.Multer.File,
    @CurrentUser() user: CurrentUserProps,
  ) {
    if (!logo) {
      throw new BadRequestException('Logo is required');
    }
    return this.workspacesService.create(createWorkspaceDto, logo, user);
  }

  @Get('/all')
  findAll() {
    return this.workspacesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.workspacesService.findOne(id);
  }

  @Patch('/update/:id')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserProps,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
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

        console.log('File received:', logo);
      } catch (error) {
        throw new BadRequestException('File validation failed.');
      }
    }
    return this.workspacesService.update(id, updateWorkspaceDto, logo, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: CurrentUserProps) {
    return this.workspacesService.remove(id, user);
  }
}
