import { TaskEnum } from '../enums/task.enum';

export const formatTaskName = ({ status }: { status: TaskEnum }) => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};
