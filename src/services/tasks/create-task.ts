import apiClient from "@/lib/api-client";
import { Task } from "@/types/task";

// TODO:: pass the task items
export const createTask = async ({
  content,
  stars,
}: {
  content: string;
  stars: number;
}) => {
  const task: Task | any = await apiClient({
    endpoint: "/tasks/create",
    method: "POST",
    body: {
      content,
      stars,
    },
  });

  return task;
};
