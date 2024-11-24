// ************************
// Task Card
// ************************
// import { Activity, Column, Task } from "@prisma/client";

export interface TaskCardProps {
  task: any; //  Task;
  isOverlay?: boolean;
}
export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: any; //Task;
}

// ************************
// Column
// ************************
// export interface ColumnWithTasks {
//   //extends  Column {
//   tasks: any; // Task[];
// }
export type ColumnWithTasks = any;

export interface TaskWithcolumn {
  //extends  Task {
  column: ColumnWithTasks;
}
export interface TaskWithColumnWithActivities {
  // extends Task {
  column: ColumnWithTasks;
  activities: any; //Activity[];
}

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: ColumnWithTasks;
}

export interface BoardColumnProps {
  column: any; // ColumnWithTasks;
  tasks: any; //Task[];
  isOverlay?: boolean;
}
