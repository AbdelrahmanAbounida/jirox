import { Task } from "@/types/task";

export interface TaskAnalyticsProps {
  total: number;
  assigned: number;
  completed: number;
  overdue: number;
  totalYesterday: number;
  assignedYesterday: number;
  completedYesterday: number;
  overdueYesterday: number;
}

const getYesterdayDate = (): Date => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday;
};

const filterTasksWithDate = (tasks: Task[], filterFC: Function, date: Date) => {
  return tasks.filter((task) => filterFC(task, date));
};

const isAssigned = (task: Task, date: Date): boolean => {
  return (
    !!task.assigneeId &&
    task.completedAt! &&
    new Date(task.completedAt) <= date &&
    task.completedAt <= task.dueDate
  );
};

const isCompleted = (task: Task, date: Date): boolean => {
  return task.completedAt! && new Date(task.dueDate) <= date;
};

const isOverdue = (task: Task, date: Date): boolean => {
  return !task.completedAt && new Date(task.dueDate) < date;
};

// Main function to calculate task analytics
export const getTaskAnalytics = (taskList: Task[]): TaskAnalyticsProps => {
  const yesterday = getYesterdayDate();

  return {
    total: taskList.length,
    assigned: filterTasksWithDate(taskList, isAssigned, new Date()).length,
    completed: filterTasksWithDate(taskList, isCompleted, new Date()).length,
    overdue: filterTasksWithDate(taskList, isOverdue, new Date()).length,

    totalYesterday: filterTasksWithDate(taskList, () => true, yesterday).length,
    assignedYesterday: filterTasksWithDate(taskList, isAssigned, yesterday)
      .length,
    completedYesterday: filterTasksWithDate(taskList, isCompleted, yesterday)
      .length,
    overdueYesterday: filterTasksWithDate(taskList, isOverdue, yesterday)
      .length,
  };
};
