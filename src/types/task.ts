import { TaskEnum } from "@/constants/enums";

export interface Task {
  name: string;
  dueDate: Date;
  status: TaskEnum;
  assigneeId?: string;
  projectId: string;
  completedAt?: Date;
}
