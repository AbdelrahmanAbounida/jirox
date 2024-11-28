import apiClient from "@/lib/api-client";
import { Member } from "@/types/members";

export const removeMember = async ({ memberId }: { memberId: string }) => {
  const resp: Member | any = await apiClient({
    endpoint: `/members/${memberId}`,
    method: "DELETE",
  });
  return resp;
};
