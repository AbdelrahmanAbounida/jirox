import { TaskEnum } from "@/constants/enums";

export function mapStatusToEnum(
  status: string | undefined
): TaskEnum | undefined {
  if (!status) return undefined;

  return Object.values(TaskEnum).find(
    (value) => value.toLowerCase() === status.toLowerCase().trim()
  );
}
