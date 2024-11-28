import apiClient from "@/lib/api-client";
import { Project } from "@/types/project";

export const createNewProject = async ({
  name,
  workspaceId,
  color,
}: {
  name: string;
  workspaceId: string;
  color: string;
}) => {
  const newProject: any | Project = await apiClient({
    endpoint: "/projects/create",
    method: "POST",
    body: JSON.stringify({
      name,
      workspaceId,
      color,
    }),
  });
  return newProject;
};
