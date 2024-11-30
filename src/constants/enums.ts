export enum WORKSPACE_MEMBER_ROLE {
  OWNER = "OWNER",
  GUEST = "GUEST",
  ADMINISTRATOR = "ADMINISTRATOR",
  CONTRIBUTOR = "CONTRIBUTOR",
  VIEWER = "VIEWER",
}

export enum TaskEnum {
  BACKLOG = "BACKLOG",
  INPROGRESS = "INPROGRESS",
  INREVIEW = "INREVIEW",
  TODO = "TODO",
  DONE = "DONE",
}

export enum ProjectColor {
  BerryRed = "#9A1F40",
  Red = "#FF0000",
  Orange = "#FFA500",
  OliveGreen = "#6B8E23",
  LimeGreen = "#32CD32",
  Green = "#008000",
  Teal = "#008080",
  SkyBlue = "#87CEEB",
  LightBlue = "#ADD8E6",
  Blue = "#0000FF",
  Grape = "#6F2DA8",
  Violet = "#8A2BE2",
  Lavender = "#E6E6FA",
  Magenta = "#FF00FF",
  Salmon = "#FA8072",
  Charcoal = "#36454F",
  Grey = "#808080",
  Taupe = "#483C32",
}

export const TASK_STATUS_NAMES: Record<TaskEnum, string> = {
  [TaskEnum.TODO]: "To Do",
  [TaskEnum.INPROGRESS]: "In Progress",
  [TaskEnum.INREVIEW]: "In Review",
  [TaskEnum.BACKLOG]: "Backlog",
  [TaskEnum.DONE]: "Done",
};
