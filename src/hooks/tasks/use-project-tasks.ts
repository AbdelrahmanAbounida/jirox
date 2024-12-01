import { getProjectTasks } from "@/services/tasks/get-project-tasks";
import useSWR from "swr";

const fetcher = async ([key, projectId]: [string, string]) => {
  const resp = await getProjectTasks({ projectId });
  return resp;
};

export const useProjectTasks = ({ projectId }: { projectId: string }) => {
  const { data, isLoading, error } = useSWR(
    ["projectTasks", projectId],
    fetcher,
    {
      refreshInterval: 1,
    }
  );
  return { data, isLoading, error };
};
