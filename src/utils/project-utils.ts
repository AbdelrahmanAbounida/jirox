import { ProjectColor } from "@/constants/enums";

export function getEnumNameByColor(color: string): ProjectColor | undefined {
  const entry = Object.entries(ProjectColor).find(
    ([_, value]) => value === color
  );
  return entry
    ? (ProjectColor[entry[0] as keyof typeof ProjectColor] as ProjectColor)
    : undefined;
}

export function mapColorToEnum(
  color: string | undefined
): ProjectColor | undefined {
  return Object.values(ProjectColor).find((value) => value === color);
}
