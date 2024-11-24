"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import {
  ColumnWithTasks,
  TaskCardProps,
  TaskDragData,
} from "@/schemas/drag-schemas";
import TaskDropdown from "./utils/task-dropdown";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function TaskCard({
  task,
  column,
  isOverlay,
}: TaskCardProps & { column: ColumnWithTasks }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-1 opacity-30 ring-gray-400",
        overlay: "ring-1 ring-gray-400",
      },
    },
  });
  // const { setTaskTobeShow } = useCurrentBoard();

  return (
    <Card
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        className:
          " cursor-grab hover:border hover:border-gray-400 opacity-100 w-[290px] shadow-none bg-white p-3 transition-all delay-1000 ",
      })}
      onClick={() => {
        // setTaskTobeShow({ ...task, column });
      }}
    >
      <CardHeader className=" justify-between items-center flex flex-row p-0 relative">
        <p className="text-sm text-left   ">{task.title}</p>
        <div
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <TaskDropdown task={task} column={column} />
        </div>
      </CardHeader>
      <Separator className="mb-3" />

      <CardContent className=" pt-4 p-0 gap-3  text-left whitespace-pre-wrap flex flex-col">
        <div className="flex items-center gap-3">
          <Avatar className="bg-gray-200 rounded-full h-5 w-5 flex items-center justify-center text-[12px] uppercase font-medium">
            A
          </Avatar>
          <div className="text-red-400 text-sm">Oktober, 4th , 2023</div>
        </div>

        <div className="flex gap-2 items-center">
          <div className=" rounded-full h-5 w-5 p-1 flex items-center justify-center text-[9px] bg-blue-600 text-white">
            W
          </div>
          <p className="text-sm">This is a project</p>
        </div>
      </CardContent>
    </Card>
  );
}
