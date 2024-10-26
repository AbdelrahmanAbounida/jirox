import {
  Injectable,
  NotFoundException,
  NotImplementedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { EntityManager, Repository } from 'typeorm';
import { AwsS3Service } from 'src/common/services/aws/services/aws.s3.service';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    private readonly entityManager: EntityManager,
    private readonly s3Service: AwsS3Service,
  ) {}

  async uploadLogo({
    logo,
    workspaceId,
  }: {
    logo: Express.Multer.File;
    workspaceId: string;
  }) {
    try {
      const storedLogo = await this.s3Service.uploadFile({
        workspaceId,
        file: logo,
      });
      return storedLogo;
    } catch (error) {
      throw new UnprocessableEntityException(
        `Failed to upload logo: ${error.message}`,
      );
    }
  }

  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    logo: Express.Multer.File,
  ) {
    const workspace = this.workspaceRepository.create(createWorkspaceDto);

    // rollback transaction
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        let savedWorkspace;
        try {
          savedWorkspace = await transactionalEntityManager.save(workspace);
          await this.uploadLogo({
            logo: logo,
            workspaceId: savedWorkspace.id,
          });
          return savedWorkspace;
        } catch (error) {
          throw new NotImplementedException(
            `Failed to create workspace: ${error.message}`,
          );
        }
      },
    );
  }

  async findAll() {
    const workspaces = await this.workspaceRepository.find();
    return workspaces;
  }

  async findOne(id: string) {
    return await this.workspaceRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
    logo: Express.Multer.File,
  ) {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      const workspace = await this.findOne(id);

      if (!workspace) {
        throw new NotFoundException(`workspace with ${id} not exist`);
      }
      // transactionalEntityManager.merge(
      //   WorkspaceEntity,
      //   workspace,
      //   updateWorkspaceDto,
      // );
      // Object.assign(workspace, updateWorkspaceDto);

      if (logo) {
        await this.s3Service.replaceFile({
          newFile: logo,
          workspaceId: workspace.id,
        });
      }

      if (updateWorkspaceDto?.name) {
        workspace.name = updateWorkspaceDto.name;
      }

      return await transactionalEntityManager.save(workspace);
    });
  }

  async remove(id: string) {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      const workspace = await this.findOne(id);

      if (!workspace) {
        throw new NotFoundException(`Workspace with id ${id} not exist`);
      }

      await transactionalEntityManager.remove(WorkspaceEntity, workspace);
      return { message: `Workspace with ID ${id} successfully deleted` };
    });
  }
}
