// ************************
// Task Card
// ************************

import { Column } from "./column";
import { Task } from "./task";

export type TaskType = "Task";
export type ColumnType = "Column";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

// ************************
// Column
// ************************

export interface ColumnWithTasks extends Column {
  tasks: Task[];
}

export interface TaskWithcolumn extends Task {
  column: ColumnWithTasks;
}

export interface ColumnDragData {
  type: ColumnType;
  column: ColumnWithTasks;
}

export interface BoardColumnProps {
  column: ColumnWithTasks;
  tasks: Task[];
  isOverlay?: boolean;
}
