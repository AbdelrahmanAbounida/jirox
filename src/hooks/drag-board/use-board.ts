import { getProjectTasks, getWorkspaceTasks } from "@/services/tasks/get-tasks";
import { Column } from "@/types/column";
import { Task } from "@/types/task";
import useSWR from "swr";

type UseBoardProps = {
  projectId?: string;
  workspaceId?: string;
};

export function useBoard({ projectId, workspaceId }: UseBoardProps) {
  const fetcher: any = async ([key, id]: [string, string]): Promise<Task[]> => {
    if (key === "projectTasks") {
      return await getProjectTasks({ projectId: id });
    } else if (key === "workspaceTasks") {
      return await getWorkspaceTasks({ workspaceId: id });
    }
    throw new Error("Invalid fetch key");
  };

  const fetchKey = projectId
    ? ["projectTasks", projectId]
    : workspaceId
    ? ["workspaceTasks", workspaceId]
    : null;

  const { data, error, isLoading, mutate } = useSWR<Task[]>(fetchKey, fetcher);

  // Group tasks by status into columns
  const columns: Column[] = data
    ? Object.entries(
        data.reduce((acc: Record<string, any[]>, task: any) => {
          const status = task.status;
          if (!acc[status]) acc[status] = [];
          acc[status].push(task);
          return acc;
        }, {})
      ).map(([status, tasks]) => ({
        id: status,
        name:
          status.charAt(0).toUpperCase() + status.slice(1).toLocaleLowerCase(),
        tasks,
      }))
    : [];

  return {
    tasks: data,
    columns,
    isLoading,
    isError: error,
    mutate,
  };
}
