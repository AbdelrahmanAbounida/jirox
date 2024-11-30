import { getTask } from "@/services/tasks/get-task";
import useSWR from "swr";

const fetcher = async ([taskId, key]: [string, string]) => {
  const resp = await getTask({ taskId });
  return resp;
};

export const useTask = (taskId: string) => {
  const { data, isLoading, error } = useSWR([taskId, "task"], fetcher);
  return { data, isLoading, error };
};
