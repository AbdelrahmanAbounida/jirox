import { TaskEnum } from "@/constants/enums";

export interface Task {
  id: string;
  name: string;
  description?: string;
  dueDate: Date;
  status: TaskEnum;
  assigneeId?: string;
  projectId: string;
  completedAt?: Date;
}

export type TaskWithWorkspaceId = Task & { workspaceId: string };
