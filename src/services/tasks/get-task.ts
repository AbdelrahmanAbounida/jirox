import apiClient from "@/lib/api-client";
import { Task } from "@/types/task";

export const getTask = async ({ taskId }: { taskId: string }) => {
  const task: Task = await apiClient({
    endpoint: `/tasks/${taskId}`,
    method: "GET",
  });
  return task;
};
