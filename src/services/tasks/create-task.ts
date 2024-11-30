import apiClient from "@/lib/api-client";
import { createTaskSchema } from "@/schemas/task-form-schema";
import { Task } from "@/types/task";
import { z } from "zod";

// TODO:: pass the task items
export const createTask = async ({
  ...props
}: z.infer<typeof createTaskSchema>) => {
  const task: Task | any = await apiClient({
    endpoint: "/tasks/create",
    method: "POST",
    body: JSON.stringify(props),
  });

  return task;
};
