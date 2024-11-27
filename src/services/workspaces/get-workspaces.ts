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
  const workspace = await apiClient({
    endpoint: `/workspace/${workspaceId}`,
    method: "GET",
  });
  return workspace;
};
