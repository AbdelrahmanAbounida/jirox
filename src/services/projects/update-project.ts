import apiClient from "@/lib/api-client";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@/schemas/project-form-schema";
import { Project } from "@/types/project";
import { z } from "zod";

export const updateProject = async ({
  name,
  logo,
  projectId,
  color,
}: z.infer<typeof updateProjectSchema> & {
  logo?: File;
  projectId: string;
}) => {
  const formData = new FormData();
  if (logo) {
    formData.append("logo", logo);
  }
  if (name) {
    formData.append("name", name);
  }
  if (color) {
    formData.append("color", color);
  }

  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
  const updatedProject: Project | any = await apiClient({
    endpoint: `/projects/update/${projectId}`,
    method: "PATCH",
    body: formData,
    isForm: true,
  });

  return updatedProject;
};
