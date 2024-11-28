import apiClient from "@/lib/api-client";
import { Workspace } from "@/types/workspace";

export const getAllWorkspaces = async () => {
  const allWorkspaces: Workspace[] = await apiClient({
    endpoint: "/workspaces/all",
    method: "GET",
  });

  return allWorkspaces;
};

export const getWorkspace = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const workspace: Workspace = await apiClient({
    endpoint: `/workspaces/${workspaceId}`,
    method: "GET",
  });
  console.log({ workspace });
  return workspace;
};
