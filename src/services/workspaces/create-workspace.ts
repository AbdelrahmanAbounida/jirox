import apiClient from "@/lib/api-client";
import { createWorkspaceSchema } from "@/schemas/ws-form-schema";
import { Workspace } from "@/types/workspace";
import { z } from "zod";

export const createWorkspace = async ({
  name,
  logo,
}: z.infer<typeof createWorkspaceSchema> & { logo: File }) => {
  const formData = new FormData();
  formData.append("logo", logo);
  formData.append("name", name);

  const newWorkspace: any = await apiClient({
    endpoint: "/workspaces/create",
    method: "POST",
    body: formData,
    isForm: true,
  });

  return newWorkspace;
};
