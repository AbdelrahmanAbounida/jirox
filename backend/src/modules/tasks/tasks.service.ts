import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { EntityManager, Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { WorkspaceMemberEntity } from '../members/entities/member.entity';
import { CurrentUserProps } from 'src/common/types/current-user';
import { WORKSPACE_MEMBER_ROLE } from '../members/enums/member.enum';
import { ProjectEntity } from '../projects/entities/project.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,

    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,

    @InjectRepository(WorkspaceMemberEntity)
    private readonly memberRepository: Repository<WorkspaceMemberEntity>,

    private readonly entityManager: EntityManager,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    // create task
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const task = this.taskRepository.create(createTaskDto);
        return transactionalEntityManager.save(task);
      },
    );
  }

  async getProjectTasks({ projectId }: { projectId: string }) {
    return this.taskRepository.find({
      where: {
        projectId,
      },
    });
  }

  async findOne(id: string) {
    return await this.taskRepository.findOneBy({
      _id: new ObjectId(id),
    });
  }

  async findOneWithAssigneeEmail(id: string) {
    const task = await this.taskRepository.findOneBy({
      _id: new ObjectId(id),
    });
    if (task) {
      const assignee = await this.memberRepository.findOneBy({
        userId: task?.assigneeId,
      });
      console.log({ assignee, id: task.assigneeId });

      return { ...task, assigneeEmail: assignee?.email };
    }
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: CurrentUserProps,
  ) {
    const { _id, id: asd, ...updateData } = updateTaskDto;

    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        // checlk if task exist
        const exist = await this.findOne(id);
        if (!exist) {
          throw new NotFoundException('No Task found with this id');
        }

        //  check user role
        await this.checkUserRole(exist, user);

        // update task using updateTaskDTO
        const updatedTask = this.taskRepository.merge(exist, updateData);
        console.log({ updatedTask });
        return transactionalEntityManager.save(updatedTask);
      },
    );
  }

  async remove(id: string, user: CurrentUserProps) {
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const task = await this.taskRepository.findOne({
          where: {
            _id: new ObjectId(id),
          },
          select: {
            project: {
              workspaceId: true,
            },
          },
        });

        if (!task) {
          throw new NotFoundException(`task with id ${id} not exist`);
        }

        // check user role
        await this.checkUserRole(task, user);
        return await transactionalEntityManager.remove(task);
      },
    );
  }

  async checkUserRole(task: TaskEntity, user: CurrentUserProps) {
    const project = await this.projectRepository.findOneBy({
      _id: new ObjectId(task?.projectId),
    });
    const membership = await this.memberRepository.findOneBy({
      workspaceId: project.workspaceId,
      userId: user.userId,
    });

    if (
      !membership ||
      (membership.role !== WORKSPACE_MEMBER_ROLE.OWNER &&
        membership.role !== WORKSPACE_MEMBER_ROLE.ADMINISTRATOR &&
        task.assigneeId != user.userId)
    ) {
      throw new ForbiddenException(
        'You dont have permission to do this action',
      );
    }
    return;
  }
}
