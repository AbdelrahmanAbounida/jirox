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

export enum TASK_STATUS {
  TODO = "TODO",
  INPROGRESS = "INPROGRESS",
  INREVIEW = "INREVIEW",
  BACKLOG = "BACKLOG",
  DONE = "DONE",
}
export const TASK_STATUS_NAMES: Record<TASK_STATUS, string> = {
  [TASK_STATUS.TODO]: "To Do",
  [TASK_STATUS.INPROGRESS]: "In Progress",
  [TASK_STATUS.INREVIEW]: "In Review",
  [TASK_STATUS.BACKLOG]: "Backlog",
  [TASK_STATUS.DONE]: "Done",
};
