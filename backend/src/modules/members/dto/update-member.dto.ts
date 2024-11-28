import { PartialType } from '@nestjs/swagger';
import { InviteMemberDto } from './create-member.dto';

export class UpdateMemberDto extends PartialType(InviteMemberDto) {}
