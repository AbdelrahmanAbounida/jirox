import { TaskEnum } from "@/constants/enums";

export interface Task {
  id: string;
  name: string;
  dueDate: Date;
  status: TaskEnum;
  assigneeId?: string;
  projectId: string;
  completedAt?: Date;
}
