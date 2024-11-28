import apiClient from "@/lib/api-client";
import { getAllProjects } from "@/services/projects/get-all-projects";
import useSWR from "swr";

const fetcher = async ([key, workspaceId]: [string, string]) => {
  const resp = await getAllProjects({ workspaceId });
  return resp;
};

export const useWorkspaceProjects = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const { data, isLoading, error } = useSWR(["projects", workspaceId], fetcher);
  return { data, isLoading, error };
};
