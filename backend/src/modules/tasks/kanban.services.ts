import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { EntityManager, Repository } from 'typeorm';
import { ProjectEntity } from '../projects/entities/project.entity';
import { WorkspaceMemberEntity } from '../members/entities/member.entity';
import { TaskEnum } from './enums/task.enum';
import { ColumnEntity } from './entities/column.entity';
import { formatTaskName } from './utils/col-utils';
import { createColumnDto, updateColumnDto } from './dto/kanban-dto';
import { UpdateTaskDto, UpdateTaskPositionDto } from './dto/update-task.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class KanbanService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,

    @InjectRepository(ColumnEntity)
    private readonly columnReposirtory: Repository<ColumnEntity>,

    private readonly entityManager: EntityManager,
  ) {}

  /**
   * create List of Default columns to workspace once u create new ws
   */
  async createDefaultCols({ projectId }: { projectId: string }) {
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const columns = Object.values(TaskEnum).map((task, index) => {
          return this.columnReposirtory.create({
            name: formatTaskName({ status: task }),
            projectId,
            position: index,
          });
        });
        return await transactionalEntityManager.save(columns);
      },
    );
  }

  async createNewColumn(createColDTO: createColumnDto) {
    // check if col exist with this name
    const exist = await this.columnReposirtory.findOneBy({
      name: createColDTO.name,
    });
    if (exist) {
      throw new ConflictException('A column with this name already exist');
    }

    return this.entityManager.transaction(async (transactoinEntityManager) => {
      const newCol = this.columnReposirtory.create(createColDTO);
      return transactoinEntityManager.save(newCol);
    });
  }

  async updateTaskPosition(updateTaskDto: UpdateTaskPositionDto) {
    const existTask = await this.taskRepository.findOneBy({
      _id: new ObjectId(updateTaskDto.taskId),
    });
    if (!existTask) {
      throw new NotFoundException('No Task found with this id');
    }
    return this.entityManager.transaction(async (transactoinEntityManager) => {
      const updatedTask = this.taskRepository.merge(existTask, {
        position: updateTaskDto.newPosition,
      });
      return transactoinEntityManager.save(updatedTask);
    });
  }

  /**
   * update Column either name or positoin
   **/
  async updateCol(updateColDto: updateColumnDto) {
    const existingColumn = await this.columnReposirtory.findOneBy({
      name: updateColDto.name,
    });
    if (!existingColumn) {
      throw new NotFoundException('No Column found with this name');
    }
    return this.entityManager.transaction(async (transactoinEntityManager) => {
      const updatedColumn = this.columnReposirtory.merge(
        existingColumn,
        updateColDto,
      );
      return transactoinEntityManager.save(updatedColumn);
    });
  }
}
