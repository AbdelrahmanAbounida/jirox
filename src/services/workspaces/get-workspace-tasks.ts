import apiClient from "@/lib/api-client";
import { Task } from "@/types/task";

export const getWorkspaceTasks = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const workspaceTasks: Task[] = await apiClient({
    endpoint: `/workspaces/tasks/${workspaceId}`,
    method: "GET",
  });

  return workspaceTasks;
};
