import useSWR from "swr";
import { getProjectTasks } from "@/services/tasks/get-tasks";

// Fetch function to get project tasks
const fetcher = async ([key, projectId]: [string, string]) => {
  const resp = await getProjectTasks({ projectId });
  return resp;
};

export const useProjectTasks = (projectId: string) => {
  const { data, error, mutate } = useSWR(["projectTasks", projectId], fetcher);
  return { data, error, mutate };
};
