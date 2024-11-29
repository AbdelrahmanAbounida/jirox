import apiClient from "@/lib/api-client";
import { getAllProjects } from "@/services/projects/get-all-projects";
import { getProjectDetails } from "@/services/projects/get-project";
import useSWR from "swr";

const fetcher = async ([key, projectId]: [string, string]) => {
  const resp = await getProjectDetails({ projectId });
  return resp;
};

export const useProjectDetails = ({ projectId }: { projectId: string }) => {
  const { data, isLoading, error } = useSWR(
    ["projectDetails", projectId],
    fetcher
  );
  return { data, isLoading, error };
};
