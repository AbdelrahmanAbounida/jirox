import { z } from "zod";
import { ProjectColor } from "./enums";

export const createProjectSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  workspaceId: z.string().min(1, { message: "Workspace is required" }),
  color: z.nativeEnum(ProjectColor),
});
