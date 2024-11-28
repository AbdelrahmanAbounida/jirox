import apiClient from "@/lib/api-client";
import { createWorkspaceSchema } from "@/schemas/ws-form-schema";
import { Workspace } from "@/types/workspace";
import { z } from "zod";

export const updateWorkspace = async ({
  name,
  logo,
  workspaceId,
}: z.infer<typeof createWorkspaceSchema> & {
  logo?: File;
  workspaceId: string;
}) => {
  const formData = new FormData();
  if (logo) {
    formData.append("logo", logo);
  }
  formData.append("name", name);

  const updatedWorkspace: Workspace | any = await apiClient({
    endpoint: `/workspaces/update/${workspaceId}`,
    method: "PATCH",
    body: formData,
    isForm: true,
  });

  return updatedWorkspace;
};
