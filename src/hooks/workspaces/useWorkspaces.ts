import { getAllWorkspaces } from "@/services/workspaces/get-workspaces";
import useSWR from "swr";

const fetcher = async () => {
  const resp = await getAllWorkspaces();
  return resp;
};

export const useWorkspaces = () => {
  const { data, isLoading, error } = useSWR("workspaces", fetcher);
  return { data, isLoading, error };
};
