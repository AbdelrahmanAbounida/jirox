import { IsBoolean, IsString } from 'class-validator';

export class ResponsdInvitationDto {
  @IsString()
  memberId: string;

  @IsBoolean()
  accept: boolean; // accept or reject
}
