import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InviteMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMemberEntity } from './entities/member.entity';
import { EntityManager, Repository } from 'typeorm';
import { ResponsdInvitationDto } from './dto/respond-membership';
import { User } from '../users/entities/user.entity';
import { WORKSPACE_MEMBER_ROLE } from './enums/member.enum';
import { CurrentUserProps } from 'src/common/types/current-user';
import { ObjectId } from 'mongodb';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(WorkspaceMemberEntity)
    private readonly memberRepository: Repository<WorkspaceMemberEntity>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly entityManager: EntityManager,
  ) {}
  async invite(createMemberDto: InviteMemberDto) {
    // 1- check if user already a mmeber
    const exist = await this.memberRepository.findOneBy({
      email: createMemberDto.email,
      workspaceId: createMemberDto.workspaceId,
    });
    if (exist) {
      throw new ConflictException(
        'The email already a member in this workspace',
      );
    }

    const newMember = await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const newMember = this.memberRepository.create({
          email: createMemberDto.email,
          workspaceId: createMemberDto.workspaceId,
          role: createMemberDto.role,
          active: false,
        });
        return await transactionalEntityManager.save(newMember);
        // TODO:: send an email to the user
      },
    );

    return newMember;
  }

  async responsdToInvitation(respondToInvitationDTO: ResponsdInvitationDto) {
    // check if member exist
    let exist = await this.memberRepository.findOneBy({
      _id: new ObjectId(respondToInvitationDTO.memberId),
    });

    if (!exist) {
      throw new ConflictException('No Invitatoin found');
    }
    // if respond true update user active and if not delete it
    return await this.entityManager.transaction(
      async (transactionEntityManager) => {
        if (respondToInvitationDTO.accept) {
          // update member
          exist.active = true;
          await transactionEntityManager.save(exist);
        } else {
          // remove member
          this.memberRepository.remove(exist);
        }
      },
    );
  }

  async getWorkspaceMembers({ workspaceId }: { workspaceId: string }) {
    const data = await this.memberRepository.find({
      where: {
        workspaceId,
      },
    });

    return data;
  }

  async findOne(id: string) {
    return `This action returns a #${id} member`;
  }

  async updateMemberRole(
    memberId: string,
    updateMemberDto: UpdateMemberDto,
    user: CurrentUserProps,
  ) {
    // first check user permissions only owner and adminstrator is able to update user roles

    // check current user membership
    const currentUserMembership = await this.memberRepository.findOneBy({
      userId: user.userId,
      workspaceId: updateMemberDto.workspaceId,
    });

    // check if current user is a member
    if (!currentUserMembership) {
      throw new NotFoundException('You are not a member of this workspace');
    }

    // check if member that u wanna edit exist
    const member = await this.memberRepository.findOneBy({
      _id: new ObjectId(memberId),
    });

    console.log({ currentUserMembership, memberId, member });

    if (!member) {
      throw new NotFoundException('No Member found with this id');
    }

    // check if the updater has enough role to do it
    if (
      currentUserMembership.role !== WORKSPACE_MEMBER_ROLE.OWNER &&
      currentUserMembership.role !== WORKSPACE_MEMBER_ROLE.ADMINISTRATOR
    ) {
      throw new ForbiddenException(
        "You dont have permission to update membres' roles",
      );
    }

    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        // if u want to change owner
        if (member.role == WORKSPACE_MEMBER_ROLE.OWNER) {
          // if the user wants to update himself
          const allowners = await this.memberRepository.find({
            where: {
              workspaceId: currentUserMembership.workspaceId,
              role: WORKSPACE_MEMBER_ROLE.OWNER,
            },
          });

          if (
            allowners.length == 1 &&
            updateMemberDto.role != WORKSPACE_MEMBER_ROLE.OWNER
          ) {
            throw new ForbiddenException(
              'Workspace must have at least one owner. Create owner first before changing it',
            );
          }

          // if ADMINISTRATOR tries to update owner
          if (
            member.role == WORKSPACE_MEMBER_ROLE.OWNER &&
            currentUserMembership.role == WORKSPACE_MEMBER_ROLE.ADMINISTRATOR
          ) {
            throw new ForbiddenException(
              'You cant update the workspace owner role',
            );
          }
        }

        member.role = updateMemberDto.role;
        return await transactionalEntityManager.save(member);
      },
    );
  }

  async remove(id: string, user: CurrentUserProps) {
    // check if member exist
    const exist = await this.memberRepository.findOneBy({
      _id: new ObjectId(id),
    });

    if (!exist) {
      throw new NotFoundException('No Member found with this id');
    }

    // check role
    const currentUserMembership = await this.memberRepository.findOneBy({
      userId: user.userId,
      workspaceId: exist.workspaceId,
    });

    if (!currentUserMembership) {
      throw new NotFoundException('You are not a member in this workspace');
    }
    if (currentUserMembership.role !== WORKSPACE_MEMBER_ROLE.OWNER) {
      throw new ForbiddenException(
        'You dont have permissions to remove a member',
      );
    }
    return this.entityManager.transaction(async (transactionEntityManager) => {
      return await transactionEntityManager.remove(exist);
    });
  }
}
