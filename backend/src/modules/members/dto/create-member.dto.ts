import { IsString } from 'class-validator';
import { WORKSPACE_MEMBER_ROLE } from '../enums/member.enum';

export class InviteMemberDto {
  @IsString()
  email: string;

  @IsString()
  workspaceId: string;

  @IsString()
  role: WORKSPACE_MEMBER_ROLE;
}
