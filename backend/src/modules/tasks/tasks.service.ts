import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    // create task
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      const task = this.taskRepository.create(createTaskDto);
      return await transactionalEntityManager.save(task);
    });
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
