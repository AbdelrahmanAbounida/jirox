import { z } from "zod";
import { TASK_STATUS } from "./enums";

const stripTime = (date: Date): Date => {
  return new Date(date.setHours(0, 0, 0, 0));
};

export const createTaskSchema = z.object({
  name: z.string().min(1, { message: "Task name is required" }),
  dueDate: z
    .date({ message: "Due Date is required" })
    .refine((date) => stripTime(date) >= stripTime(new Date()), {
      message: "Due Date cannot be in the past",
    }),
  assigneeId: z.string().min(1, { message: "Assignee is required" }),
  status: z.nativeEnum(TASK_STATUS),
  projectId: z.string().min(1, { message: "Project is reqiured" }),
});

export const editTaskSchema = createTaskSchema.extend({});
