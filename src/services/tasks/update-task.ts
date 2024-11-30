import apiClient from "@/lib/api-client";
import { createTaskSchema, editTaskSchema } from "@/schemas/task-form-schema";
import { z } from "zod";
import { Task } from "@/types/task";

export const updateTask = async ({
  ...props
}: z.infer<typeof editTaskSchema> & {
  taskId: string;
}) => {
  const updatedTask: Task | any = await apiClient({
    endpoint: `/tasks/update/${props.taskId}`,
    method: "PATCH",
    body: JSON.stringify(props),
  });

  return updatedTask;
};
