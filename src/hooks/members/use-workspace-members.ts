import { getWorkspaceMembers } from "@/services/members/get-workspace-members";
import useSWR from "swr";

const fetcher = async ([workspaceId, key]: [string, string]) => {
  const resp = await getWorkspaceMembers({ workspaceId });
  return resp;
};

export const useWorkspaceMembers = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const { data, isLoading, error } = useSWR([workspaceId, "members"], fetcher);
  return { data, isLoading, error };
};
