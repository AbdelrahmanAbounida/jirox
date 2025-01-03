import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
});

export const updateWorkspaceSchema = createWorkspaceSchema;
