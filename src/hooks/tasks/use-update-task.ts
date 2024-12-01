import { TaskEnum } from "@/constants/enums";
import { Task } from "@/types/task";
import { create } from "zustand";

type EditTaskStore = {
  assingeeId: string;
  setAssigneeId: (newId: string) => void;

  assigneeEmail: string;
  setAssigneeEmail: (newEmail: string) => void;

  dueDate: Date | null;
  setdueDate: (newDate: Date) => void;

  status: TaskEnum;
  setStatus: (newTask: TaskEnum) => void;

  description: string;
  setDescription: (newDescription: string) => void;

  loadTask: (task: Task & { assigneeEmail: string }) => void;
  taskLoaded: boolean;
  setTaskLoaded: (newVal: boolean) => void;
};

export const useUpdateTask = create<EditTaskStore>((set) => ({
  assingeeId: "",
  assigneeEmail: "",
  dueDate: null,
  status: TaskEnum.TODO,
  description: "",

  // Actions
  setAssigneeEmail(newEmail) {
    set({ assigneeEmail: newEmail });
  },
  setAssigneeId(newAssigneeId) {
    set({ assingeeId: newAssigneeId });
  },

  setdueDate(newDate) {
    set({ dueDate: newDate });
  },

  setStatus(newTask) {
    set({ status: newTask });
  },

  setDescription(newDescription) {
    set({ description: newDescription });
  },

  loadTask(task) {
    set({
      assingeeId: task.assigneeId,
      dueDate: task.dueDate,
      status: task.status,
      description: task.description,
      assigneeEmail: task.assigneeEmail,
      taskLoaded: true,
    });
  },

  taskLoaded: false,
  setTaskLoaded(newVal) {
    set({
      taskLoaded: newVal,
    });
  },
}));
