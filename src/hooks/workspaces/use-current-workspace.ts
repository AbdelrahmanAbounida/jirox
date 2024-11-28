import { getWorkspace } from "@/services/workspaces/get-workspaces";
import useSWR from "swr";

const fetcher = async ([workspaceId, key]: [string, string]) => {
  const resp = await getWorkspace({ workspaceId });
  return resp;
};

export const useCurrentWorkspace = (workspaceId: string) => {
  const { data, isLoading, error } = useSWR(
    [workspaceId, "currentWorkspace"],
    fetcher
  );
  return { data, isLoading, error };
};
