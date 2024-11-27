import {
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { EntityManager, Repository } from 'typeorm';
import { AwsS3Service } from 'src/common/services/aws/services/aws.s3.service';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { User } from '../users/entities/user.entity';

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
    userId,
  }: {
    logo: Express.Multer.File;
    userId: string;
  }) {
    try {
      console.log({ userId });
      const storedLogo = await this.s3Service.uploadFile({
        userId,
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
    user: User,
  ) {
    if (!user) {
      throw new UnauthorizedException(
        'You are not authorized to create Workspace',
      );
    }

    // check if there is a workspace with this name
    const exist = await this.workspaceRepository.findOneBy({
      name: createWorkspaceDto.name,
      ownerId: user.id,
    });

    if (exist) {
      throw new ConflictException('a workspace with this name already exist');
    }

    const workspace = this.workspaceRepository.create({
      ...createWorkspaceDto,
      ownerId: user.id,
    });

    // rollback transaction
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        try {
          const storedLogo = await this.uploadLogo({
            logo: logo,
            userId: user.id,
          });
          workspace.logo = storedLogo;
          const savedWorkspace =
            await transactionalEntityManager.save(workspace);

          return savedWorkspace;
        } catch (error) {
          console.log({ error });
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
    user: User,
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
          userId: user.id,
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
