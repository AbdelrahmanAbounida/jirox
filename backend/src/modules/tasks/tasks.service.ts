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

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,

    @InjectRepository(WorkspaceMemberEntity)
    private readonly memberRepository: Repository<WorkspaceMemberEntity>,

    private readonly entityManager: EntityManager,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    // create task
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const task = this.taskRepository.create(createTaskDto);
        console.log({ task });
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

  findAll() {
    return `This action returns all tasks`;
  }

  async findOne(id: string) {
    return this.taskRepository.findOneBy({
      _id: new ObjectId(id),
    });
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: CurrentUserProps,
  ) {
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        // checlk if task exist
        const exist = await this.taskRepository.findOneBy({
          _id: new ObjectId(id),
          project: true,
        });
        if (!exist) {
          throw new NotFoundException('No Task found with this id');
        }

        //  check user role
        await this.checkUserRole(exist, user);

        // update task using updateTaskDTO
        const updatedTask = this.taskRepository.merge(exist, updateTaskDto);
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
    const membership = await this.memberRepository.findOneBy({
      workspaceId: task.project.workspaceId,
      userId: user.userId,
    });

    if (
      !membership ||
      (membership.role !== WORKSPACE_MEMBER_ROLE.OWNER &&
        membership.role !== WORKSPACE_MEMBER_ROLE.ADMINISTRATOR) ||
      task.assigneeId != user.userId
    ) {
      throw new ForbiddenException(
        'You dont have permission to delete the task',
      );
    }
    return;
  }
}
