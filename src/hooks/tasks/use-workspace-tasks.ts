import { getWorkspaceTasks } from "@/services/tasks/get-tasks";
import useSWR from "swr";

const fetcher = async ([workspaceId, key]: [string, string]) => {
  const resp = await getWorkspaceTasks({ workspaceId });
  return resp;
};

export const useWorkspaceTasks = ({ workspaceId }: { workspaceId: string }) => {
  if (!workspaceId) {
    return {
      data: [],
      isLoading: false,
      error: null,
    };
  }
  const { data, isLoading, error } = useSWR(
    [workspaceId, "workspaceTasks"],
    fetcher
  );
  return { data, isLoading, error };
};
