import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CurrentUserProps } from 'src/common/types/current-user';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly entityManager: EntityManager,
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
    const newProject = await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const newProject = this.projectRepository.create({
          name: createProjectDto.name,
          ownerId: user.userId,
          workspaceId: createProjectDto.workspaceId,
          color: createProjectDto.color,
        });
        console.log({ newProject });
        return await transactionalEntityManager.save(newProject);
      },
    );

    return newProject;
  }

  async findAll({ workspaceId }: { workspaceId: string }) {
    return this.projectRepository.find({
      where: { workspaceId },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
