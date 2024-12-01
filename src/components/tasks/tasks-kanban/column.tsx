import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TaskCard } from "./task-card";
import { BoardColumnProps, ColumnDragData } from "@/types/drag";
import ColumnDropdown from "./utils/col-dropdown";
import EmptyTask from "./utils/empty-task";
import { Input } from "@/components/ui/input";

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task: any) => task?.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.name}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "  items-center  flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  // new col title
  const [newcolTitle, setnewcolTitle] = useState(column.name);

  return (
    <div className=" w-[320px] flex flex-col max-h-[700px] overflow-auto scrollbar-custom">
      <Card
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        className={variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
          className:
            "cursor-grab overflow-y-auto overflow-x-hidden border-none shadow-none bg-transparent p-0",
        })}
      >
        <CardHeader
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          className="w-[280px]  p-0 font-semibold my-2 text-left flex flex-row cursor-default justify-between items-center"
        >
          <Input
            className="border-0 focus:p-2 flex-1 shadow-none font-semibold text-sm p-0 focus:border"
            value={newcolTitle}
            onChange={(e) => setnewcolTitle(e.target.value)}
            // onBlur={handleupdateColtitle}
          />
          {/** col dropdown */}
          <ColumnDropdown column={column} />
        </CardHeader>
        <div
          {...attributes}
          {...listeners}
          className="drag-area overflow-x-hidden "
        >
          <CardContent className="flex flex-grow flex-col gap-2  p-3 ">
            <SortableContext items={tasksIds}>
              {tasks.map((task: any) => (
                <TaskCard column={column} key={task?.id} task={task} />
              ))}
              <EmptyTask columnId={column.id} newPos={tasks.length!} />
            </SortableContext>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
