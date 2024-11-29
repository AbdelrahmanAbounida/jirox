import apiClient from "@/lib/api-client";
import { Project } from "@/types/project";

export const deleteProject = async ({ projectId }: { projectId: string }) => {
  const project: Project | any = await apiClient({
    endpoint: `/projects/${projectId}`,
    method: "DELETE",
  });
  return project;
};
