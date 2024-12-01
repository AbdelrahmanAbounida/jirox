import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { EntityManager, Repository } from 'typeorm';
import { TaskEnum } from './enums/task.enum';
import { formatTaskName } from './utils/col-utils';
import { UpdateTaskPositionDto } from './dto/update-task.dto';
import { ObjectId } from 'mongodb';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class KanbanService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,

    private readonly entityManager: EntityManager,
  ) {}

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
   * create List of Default columns to workspace once u create new ws
   */
  // async createDefaultCols({ projectId }: { projectId: string }) {
  //   return this.entityManager.transaction(
  //     async (transactionalEntityManager) => {
  //       const columns = Object.values(TaskEnum).map((task, index) => {
  //         return this.columnReposirtory.create({
  //           name: formatTaskName({ status: task }),
  //           projectId,
  //           position: index,
  //         });
  //       });
  //       return await transactionalEntityManager.save(columns);
  //     },
  //   );
  // }

  // async createNewColumn(createColDTO: createColumnDto) {
  //   // check if col exist with this name
  //   const exist = await this.columnReposirtory.findOneBy({
  //     name: createColDTO.name,
  //   });
  //   if (exist) {
  //     throw new ConflictException('A column with this name already exist');
  //   }

  //   return this.entityManager.transaction(async (transactoinEntityManager) => {
  //     const newCol = this.columnReposirtory.create(createColDTO);
  //     return transactoinEntityManager.save(newCol);
  //   });
  // }

  /**
   * update Column either name or positoin
   **/
  // async updateCol(updateColDto: updateColumnDto) {
  //   const existingColumn = await this.columnReposirtory.findOneBy({
  //     name: updateColDto.name,
  //   });
  //   if (!existingColumn) {
  //     throw new NotFoundException('No Column found with this name');
  //   }
  //   return this.entityManager.transaction(async (transactoinEntityManager) => {
  //     const updatedColumn = this.columnReposirtory.merge(
  //       existingColumn,
  //       updateColDto,
  //     );
  //     return transactoinEntityManager.save(updatedColumn);
  //   });
  // }

  // async getWorkspaceColumns(workspaceId: string) {
  //   try {
  //     // get workspace projects
  //     const projects = await this.projectsService.findWorkspaceProjects({
  //       workspaceId,
  //     });

  //     // map over projects and get the column of each and then merge
  //     const projectIds = [...new Set(projects.map((project) => project.id))];
  //     console.log({ projectIds });

  //     const columns = await Promise.all(
  //       projectIds.map((projectId) => {
  //         return this.columnReposirtory.find({
  //           projectId,
  //         });
  //       }),
  //     );

  //     console.log({ columns });

  //     const res = Array.from(new Set(columns.flat()));
  //     console.log({ res });
  //     return res;
  //   } catch (err) {
  //     console.log({ err });
  //     return [];
  //   }
  // }

  // async getProjectColumns(projectId: string) {
  //   return this.columnReposirtory.findBy({
  //     projectId,
  //   });
  // }
}
