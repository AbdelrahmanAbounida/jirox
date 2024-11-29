import { Task } from "@/types/task";
import apiClient from "@/lib/api-client";

export const deleteTask = async ({ taskId }: { taskId: string }) => {
  const task: Task | any = await apiClient({
    endpoint: `/tasks/${taskId}`,
    method: "DELETE",
  });
  return task;
};
