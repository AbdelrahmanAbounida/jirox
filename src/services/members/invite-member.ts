import { WORKSPACE_MEMBER_ROLE } from "@/constants/enums";
import apiClient from "@/lib/api-client";
import { Member } from "@/types/members";

export const inviteNewMember = async ({
  workspaceId,
  email,
  role,
}: {
  workspaceId: string;
  email: string;
  role: WORKSPACE_MEMBER_ROLE;
}) => {
  const invitedMember: Member | any = await apiClient({
    endpoint: "/members/invite",
    method: "POSt",
    body: JSON.stringify({
      workspaceId,
      email,
      role,
    }),
  });

  return invitedMember;
};
