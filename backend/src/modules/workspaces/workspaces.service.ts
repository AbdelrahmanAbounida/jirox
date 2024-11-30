import {
  ConflictException,
  ForbiddenException,
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
import { User } from '../users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { WorkspaceMemberEntity } from '../members/entities/member.entity';
import { WORKSPACE_MEMBER_ROLE } from '../members/enums/member.enum';
import { ObjectId } from 'mongodb';
import { CurrentUserProps } from 'src/common/types/current-user';
import { TaskEntity } from '../tasks/entities/task.entity';
import { ProjectEntity } from '../projects/entities/project.entity';
import { In } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,

    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,

    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,

    @InjectRepository(WorkspaceMemberEntity)
    private readonly memberRepository: Repository<WorkspaceMemberEntity>,

    private readonly projectService: ProjectsService,
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
    user: CurrentUserProps,
  ) {
    if (!user) {
      throw new UnauthorizedException(
        'You are not authorized to create Workspace',
      );
    }

    // check if there is a workspace with this name
    const exist = await this.workspaceRepository.findOneBy({
      name: createWorkspaceDto.name,
      ownerId: user.userId,
    });

    if (exist) {
      throw new ConflictException('a workspace with this name already exist');
    }

    const workspace = this.workspaceRepository.create({
      ...createWorkspaceDto,
      ownerId: user.userId,
    });

    // rollback transaction
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        try {
          // upload logo
          const storedLogo = await this.uploadLogo({
            logo: logo,
            userId: user.userId,
          });
          workspace.logo = storedLogo;

          // save workspace
          const savedWorkspace =
            await transactionalEntityManager.save(workspace);

          // create defaule project
          await this.projectService.create(
            {
              name: 'default',
              workspaceId: savedWorkspace.id,
              color: '#808080', // gray
            },
            user,
          );
          // add this owner as member of this workspace
          const newMember = this.memberRepository.create({
            active: true,
            email: user.email,
            role: WORKSPACE_MEMBER_ROLE.OWNER,
            workspaceId: savedWorkspace.id,
            userId: user.userId,
          });
          console.log({ newMember });
          console.log({ userId: user.userId });
          await transactionalEntityManager.save(newMember);

          return savedWorkspace;
        } catch (error) {
          console.log({ error });
          // TODO:: remove logo
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
    // const data = await this.workspaceRepository.findOne({ where: { id } });
    const data = await this.workspaceRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    return data;
  }

  async findAllWorkspaceTasks(workspaceId: string) {
    const workspace = await this.workspaceRepository.findOne({
      where: { _id: new ObjectId(workspaceId) },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Fetch projects
    const projects = await this.projectRepository.find({
      where: { workspaceId },
      select: ['_id', 'name'],
    });

    const projectMap = new Map(projects.map((p) => [p.id, p.name]));
    const projectIds = projects.map((p) => p.id);

    // Fetch tasks
    const tasks = await this.taskRepository.find({
      where: { projectId: { $in: projectIds } as any },
    });

    // Fetch assignees
    const assigneeIds = tasks
      .map((task) => task.assigneeId)
      .filter((id): id is string => !!id)
      .map((id) => new ObjectId(id));

    const assignees = await this.memberRepository.find({
      where: { _id: { $in: assigneeIds } as any },
    });

    const assigneeMap = new Map(
      assignees.map((user) => [user._id.toString(), user.email]),
    );

    // Enrich tasks with project names and assignee emails
    const enrichedTasks = tasks.map((task) => ({
      ...task,
      projectName: projectMap.get(task.projectId.toString()),
      assigneeEmail: task.assigneeId
        ? assigneeMap.get(task.assigneeId.toString()) || null
        : null,
    }));

    return enrichedTasks;
  }

  async update(
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
    logo: Express.Multer.File,
    user: CurrentUserProps,
  ) {
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const workspace = await this.workspaceRepository.findOneBy({
          _id: new ObjectId(id),
        });
        if (!workspace) {
          throw new NotFoundException(`workspace with ${id} not exist`);
        }

        // update logo
        if (logo) {
          const oldFileName = workspace.logo.split('/').pop();
          const newLogo = await this.s3Service.replaceFile({
            newFile: logo,
            userId: user.userId,
            oldFileName,
          });
          workspace.logo = newLogo;
        }

        // update name
        if (updateWorkspaceDto?.name) {
          // check if this name is new
          if (workspace.name != updateWorkspaceDto.name) {
            const exist = await this.workspaceRepository.findOneBy({
              name: updateWorkspaceDto.name,
              ownerId: user.userId,
            });
            if (exist) {
              throw new ConflictException(
                'Workspace with this name already exist',
              );
            }
          }
          workspace.name = updateWorkspaceDto.name;
        }
        return await transactionalEntityManager.save(workspace);
      },
    );
  }

  async remove(id: string, user: CurrentUserProps) {
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const workspace = await this.findOne(id);

        if (!workspace) {
          throw new NotFoundException(`Workspace with id ${id} not exist`);
        }

        // check user role
        const membership = await this.memberRepository.findOneBy({
          workspaceId: id,
          userId: user.userId,
        });

        if (!membership || membership.role !== WORKSPACE_MEMBER_ROLE.OWNER) {
          throw new ForbiddenException(
            'You dont have permission to delete the workspace',
          );
        }

        return await transactionalEntityManager.remove(
          WorkspaceEntity,
          workspace,
        );
      },
    );
  }
}
