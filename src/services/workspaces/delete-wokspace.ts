import apiClient from "@/lib/api-client";
import { Workspace } from "@/types/workspace";

export const deleteWorkspace = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const workspace: Workspace | any = await apiClient({
    endpoint: `/workspaces/${workspaceId}`,
    method: "DELETE",
  });
  return workspace;
};
