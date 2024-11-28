import apiClient from "@/lib/api-client";
import { Member } from "@/types/members";

export const updateMemberRole = async ({
  memberId,
  workspaceId,
  newRole,
}: {
  memberId: string;
  workspaceId: string;
  newRole: string;
}) => {
  const updatedMember: Member | any = await apiClient({
    endpoint: `/members/update/${memberId}`,
    method: "PATCH",
    body: JSON.stringify({
      role: newRole,
      workspaceId,
    }),
  });

  return updatedMember;
};
