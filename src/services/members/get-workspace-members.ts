import apiClient from "@/lib/api-client";
import { Member } from "@/types/members";

export const getWorkspaceMembers = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const members: Member[] = await apiClient({
    endpoint: `/members/all/${workspaceId}`,
    method: "GEt",
  });

  return members;
};
