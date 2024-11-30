import { ProjectColor } from "@/constants/enums";
import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  color: z.nativeEnum(ProjectColor),
});

export const updateProjectSchema = createProjectSchema.partial();
