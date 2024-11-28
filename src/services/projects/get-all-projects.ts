import apiClient from "@/lib/api-client";
import { Project } from "@/types/project";

export const getAllProjects = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const projects: Project[] = await apiClient({
    endpoint: `/projects/all/${workspaceId}`,
    method: "GET",
  });
  return projects;
};
