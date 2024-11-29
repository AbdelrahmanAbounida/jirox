import apiClient from "@/lib/api-client";
import { Project } from "@/types/project";

export const getProjectDetails = async ({
  projectId,
}: {
  projectId: string;
}) => {
  const project: Project | any = await apiClient({
    endpoint: `/projects/${projectId}`,
    method: "GET",
  });

  return project;
};
