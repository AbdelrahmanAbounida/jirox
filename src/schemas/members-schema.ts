import { WORKSPACE_MEMBER_ROLE } from "@/constants/enums";
import { z } from "zod";

export const addMemberSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
  role: z.nativeEnum(WORKSPACE_MEMBER_ROLE),
});
