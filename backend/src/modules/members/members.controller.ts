import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { InviteMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ResponsdInvitationDto } from './dto/respond-membership';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CurrentUserProps } from 'src/common/types/current-user';

@ApiTags('Members')
@Controller({
  version: '1',
  path: 'members',
})
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('/invite')
  invite(@Body() inviteMemberDto: InviteMemberDto) {
    return this.membersService.invite(inviteMemberDto);
  }

  @Post('/respond-invitation')
  respondToInvitation(@Body() responsdInvitationDto: ResponsdInvitationDto) {
    return this.membersService.responsdToInvitation(responsdInvitationDto);
  }

  @Get('/all/:workspaceId')
  @ApiOperation({ summary: 'Get all members of a workspace' })
  @ApiParam({
    name: 'workspaceId',
    description: 'The unique ID of the workspace',
    type: String,
    example: '6746be277b3137ce276164ad',
  })
  findAllWorkspaceMembers(@Param('workspaceId') workspaceId: string) {
    return this.membersService.getWorkspaceMembers({ workspaceId });
  }

  @Get(':userId')
  findallMemberships(@Param('userId') id: string) {
    return this.membersService.findOne(id);
  }

  @Patch('/update/:memberId')
  updateMemerRole(
    @Param('memberId') memberId: string,
    @Body() updateMemberDto: UpdateMemberDto,
    @CurrentUser() user: CurrentUserProps,
  ) {
    return this.membersService.updateMemberRole(
      memberId,
      updateMemberDto,
      user,
    );
  }

  @Delete(':id')
  async removeMemer(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserProps,
  ) {
    return this.membersService.remove(id, user);
  }
}
