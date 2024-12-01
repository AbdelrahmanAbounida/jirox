import { WORKSPACE_MEMBER_ROLE } from "@/constants/enums";

export interface Member {
  id: string;
  email: string;
  userId: string;
  workspaceId: string;
  role: WORKSPACE_MEMBER_ROLE;
  active: boolean;
}
