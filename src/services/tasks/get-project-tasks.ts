import { Task } from "@/types/task";
import apiClient from "@/lib/api-client";

export const getProjectTasks = async ({ projectId }: { projectId: string }) => {
  const tasks: Task[] = await apiClient({
    endpoint: `/tasks/project-tasks/${projectId}`,
    method: "GET",
  });

  return tasks;
};
