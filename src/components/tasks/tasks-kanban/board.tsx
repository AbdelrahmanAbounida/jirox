"use client";
import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
  useDndContext,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { cva } from "class-variance-authority";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { BoardColumn } from "./column";
import { TaskCard } from "./task-card";
import { ColumnWithTasks } from "@/types/drag";
import { hasDraggableData } from "./utils/drag-utils";

import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Task } from "@/types/task";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoard } from "@/hooks/drag-board/use-board";
import { TaskEnum } from "@/constants/enums";

export type ColumnId = string;

/** >> This is the entry point */
export function KanbanBoard({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId?: string;
}) {
  const {
    columns: cols,
    isLoading,
    mutate,
  } = useBoard({
    projectId,
    workspaceId,
  });

  const columnsId = useMemo(() => cols.map((col) => col.id), [cols]);

  const [activeColumn, setActiveColumn] = useState<ColumnWithTasks | null>(
    null
  );
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // to give time for click event if so
      },
    })
  );

  return isLoading ? (
    <KanbanSkeleton />
  ) : (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      {/* main board */}
      <BoardContainer>
        <SortableContext items={columnsId!}>
          {/* List of columns */}
          {cols?.map((col: any) => (
            <BoardColumn key={col.id} column={col} tasks={col?.tasks} />
          ))}
        </SortableContext>
      </BoardContainer>

      {/* overlay */}
      {"document" in window &&
        createPortal(
          <DragOverlay>
            {/* 1- for dragging column */}
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={activeColumn.tasks}
              />
            )}
            {/* 2- for dragging task */}
            {activeTask && (
              <TaskCard task={activeTask} column={activeColumn!} isOverlay />
            )}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;

    // drag col
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      // setActiveTasks(data.column.tasks);
      return;
    }
    // drag task
    if (data?.type === "Task") {
      setActiveTask(data.task);
      return;
    }
  }

  // for col drag
  async function onDragEnd(event: DragEndEvent) {
    // TODO:: check col workspace positoin and project position
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;
    const activeData = active.data.current;
    if (activeId === overId) return;

    // drag col end
    const isActiveAColumn = activeData?.type === "Column";
    if (!isActiveAColumn) return;

    const activeColumnIndex = cols?.findIndex((col) => col.id === activeId);
    const overColumnIndex = cols?.findIndex((col) => col.id === overId);
    const newCols = arrayMove(cols!, activeColumnIndex!, overColumnIndex!);

    //optimistic update >>> TODO:: check logic of updating both global and project pos
    mutate(
      (prevData: any) => ({
        ...prevData,
        columns: newCols,
      }),
      {
        optimisticData: newCols.map((col) => col.tasks).flat(),
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      }
    );
    toast.success("Columns swapped successfully");
  }

  // for task drag
  async function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    const isActiveTask = activeData?.type === "Task";
    const isOverTask = overData?.type === "Task";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      const activeTask = activeData.task;
      const overTask = overData.task;

      // get active cols tasks
      if (activeTask && overTask && activeTask.columnId === overTask.columnId) {
        const activeColumn = cols?.find(
          (col) => col.id === activeTask.columnId
        );

        const activeIndex = activeColumn?.tasks.findIndex(
          (task: any) => task.id == activeTask.id
        );
        const overIndex = activeColumn?.tasks.findIndex(
          (task: any) => task.id == overTask.id
        );

        // both dragged tasks exist
        if (activeIndex! >= 0 && overIndex! >= 0) {
          // Im dropping a Task over another Task (same col)
          const oldTasks = activeColumn?.tasks;
          const newTasks = arrayMove(oldTasks!, activeIndex!, overIndex!);

          // TODO:: update col hook either workspace pos or global pos
          // setcolTasks(newTasks, activeColumn!);

          // mutate(
          //   (prevData: any) => ({
          //     ...prevData,
          //     columns: newCols,
          //   }),
          //   {
          //     optimisticData: newCols,
          //     populateCache: true ,
          //     revalidate: false,
          //     rollbackOnError: true
          //   }
          // );
        }
      }
      // Im dropping a Task over another Task (different column)
      else if (
        activeTask &&
        overTask &&
        activeTask.columnId !== overTask.columnId
      ) {
        if (isActiveTask && overTask) {
          // switch cols
          const activeColumn = cols?.find(
            (col) => col.id === activeTask.columnId
          );
          const overColumn = cols?.find((col) => col.id === overTask.columnId);

          // switch tasks
          const oldActiveTasks = activeColumn?.tasks;
          const oldOverTasks = overColumn?.tasks;

          // switch positions
          const activeIndex = activeColumn?.tasks.findIndex(
            (task: any) => task.id == activeTask.id
          );
          const overIndex = overColumn?.tasks.findIndex(
            (task: any) => task.id == overTask.id
          );

          if (activeIndex! > -1 && overIndex! > -1) {
            oldActiveTasks?.splice(activeIndex!, 1);
            oldOverTasks?.splice(overIndex!, 0, activeTask);
            activeTask.columnId = overTask.columnId;

            // TODO:: update status with hoo k
            // mutate(
            //   (prevData: any) => ({
            //     ...prevData,
            //     columns: newCols,
            //   }),
            //   {
            //     optimisticData: newCols,
            //     populateCache: true ,
            //     revalidate: false,
            //     rollbackOnError: true
            //   }
            // );

            // setcolTasks(oldActiveTasks!, activeColumn!);
            // setcolTasks(oldOverTasks!, overColumn!);
          }
        }
      }
    }
  }
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
        className: "w-full  h-full bg-[#f8f8f9]  ",
      })}
    >
      <div className="flex gap-4 items-start flex-row justify-start p-2  w-full ">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default KanbanBoard;
const KanbanSkeleton = () => (
  <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
    <Skeleton className="w-full h-12 rounded-lg" />
    <div className="w-full flex space-x-4">
      <Skeleton className="w-32 h-48 rounded-lg" />
      <Skeleton className="w-32 h-48 rounded-lg" />
      <Skeleton className="w-32 h-48 rounded-lg" />
    </div>
  </div>
);
