import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { EntityManager, Repository } from 'typeorm';
import { CurrentUserProps } from 'src/common/types/current-user';
import { ObjectId } from 'mongodb';
import { WorkspaceMemberEntity } from '../members/entities/member.entity';
import { WORKSPACE_MEMBER_ROLE } from '../members/enums/member.enum';
import { AwsS3Service } from 'src/common/services/aws/services/aws.s3.service';
import { KanbanService } from '../tasks/kanban.services';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,

    @InjectRepository(WorkspaceMemberEntity)
    private readonly memberRepository: Repository<WorkspaceMemberEntity>,

    private readonly entityManager: EntityManager,
    private readonly s3Service: AwsS3Service,

    @Inject(forwardRef(() => KanbanService))
    private readonly kanbanService: KanbanService,
  ) {}
  async create(createProjectDto: CreateProjectDto, user: CurrentUserProps) {
    // check if project with same name exist
    const exist = await this.projectRepository.findOneBy({
      name: createProjectDto.name,
      workspaceId: createProjectDto.workspaceId,
    });
    if (exist) {
      throw new ConflictException(
        'Project with the same name already exist in this workspace',
      );
    }

    // TODO:: not all user should be able to create a project
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const newProject = this.projectRepository.create({
          name: createProjectDto.name,
          ownerId: user.userId,
          workspaceId: createProjectDto.workspaceId,
          color: createProjectDto.color,
        });
        return await transactionalEntityManager.save(newProject);
      },
    );
  }

  async findWorkspaceProjects({ workspaceId }: { workspaceId: string }) {
    return this.projectRepository.find({
      where: { workspaceId },
    });
  }

  async findOne(id: string) {
    const data = await this.projectRepository.findOneBy({
      _id: new ObjectId(id),
    });
    return data;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    logo: Express.Multer.File,
    user: CurrentUserProps,
  ) {
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const project = await this.projectRepository.findOneBy({
          _id: new ObjectId(id),
        });
        if (!project) {
          throw new NotFoundException(`project with ${id} not exist`);
        }

        // check role
        await this.checkUserRole(project, user);

        // update logo
        if (logo) {
          const oldFileName = project.logo?.split('/').pop()!;
          const newLogo = await this.s3Service.replaceFile({
            newFile: logo,
            userId: user.userId,
            oldFileName,
          });
          project.logo = newLogo;
        }

        // update name
        if (updateProjectDto?.name) {
          // check if this name is new
          if (project.name != updateProjectDto.name) {
            const exist = await this.projectRepository.findOneBy({
              name: updateProjectDto.name,
              ownerId: user.userId,
            });
            if (exist) {
              throw new ConflictException(
                'Project with this name already exist',
              );
            }
          }
          project.name = updateProjectDto.name;
        }
        return await transactionalEntityManager.save(project);
      },
    );
  }

  async remove(id: string, user: CurrentUserProps) {
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const project = await this.projectRepository.findOne({
          where: {
            _id: new ObjectId(id),
          },
        });

        if (!project) {
          throw new NotFoundException(`project with id ${id} not exist`);
        }

        // check if this is the only project
        const projectsList = await this.projectRepository.find({
          where: {
            workspaceId: project.workspaceId,
          },
        });

        if (projectsList.length == 1) {
          throw new ForbiddenException(
            "You can't keep workspace empty create new project  before deleting this one",
          );
        }

        // check user role
        await this.checkUserRole(project, user);

        return await transactionalEntityManager.remove(project);
      },
    );
  }

  async checkUserRole(project: ProjectEntity, user: CurrentUserProps) {
    const membership = await this.memberRepository.findOneBy({
      workspaceId: project.workspaceId,
      userId: user.userId,
    });

    if (
      !membership ||
      (membership.role !== WORKSPACE_MEMBER_ROLE.OWNER &&
        membership.role !== WORKSPACE_MEMBER_ROLE.ADMINISTRATOR) ||
      project.ownerId != user.userId
    ) {
      throw new ForbiddenException(
        'You dont have permission to delete the task',
      );
    }
    return;
  }
}
