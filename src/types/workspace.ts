import { User } from "@prisma/client";

export interface Workspace {
  id: string;
  name: string;
  logo: string;
  owner: User;
}
