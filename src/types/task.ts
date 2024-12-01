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
  position: number;
  workspacePosition: number;
}

export type TaskWithWorkspaceId = Task & { workspaceId: string };
