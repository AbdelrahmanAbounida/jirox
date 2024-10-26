"use server";
import apiClient from "@/lib/api-client";

export const getAllWorkspaces = async () => {
  const allTasks = await apiClient({
    endpoint: "/workspaces/all",
    method: "GET",
  });

  return allTasks;
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
