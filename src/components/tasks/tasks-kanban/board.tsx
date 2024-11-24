"use client";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { ColumnWithTasks } from "@/schemas/drag-schemas";
import { hasDraggableData } from "./utils/drag-utils";
import EmptyColumn from "./utils/empty-col";

import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Task } from "./interfaces";
import { useCurrentBoard } from "@/hooks/use-current-board";

// import { Task } from "@prisma/client";
// import { updateColsPositions } from "@/actions/col/update-cols";
// import { updateColTaskPositions } from "@/actions/task/update-task";
// import { useCurrentBoard } from "@/hooks/drag-board/use-current-board";

export type ColumnId = string;

export function KanbanBoard({
  boardColumns,
  boardId,
}: {
  boardColumns: ColumnWithTasks[];
  boardId: string;
}) {
  // const [columns, setColumns] = useState<ColumnWithTasks[]>(boardColumns);
  const { cols, setcolTasks, setCols } = useCurrentBoard();

  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => cols.map((col: any) => col.id), [cols]);
  // const [activetasks, setActiveTasks] = useState<Task[]>([]);
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
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: coordinateGetter,
    // })
  );
  useEffect(() => {
    setCols(boardColumns);
  }, [boardColumns]);

  // const { isGlobalLoading } = useGlobalLoading();
  const isGlobalLoading = false;

  return isGlobalLoading ? (
    <div className="h-full  w-full flex flex-col text-slate-300 text-2xl opacity-100  items-center justify-center">
      <ReloadIcon className="animate-spin h-20 w-20 text-white" fill="white" />
      Copying Board
    </div>
  ) : (
    <DndContext
      //   accessibility={{
      //     announcements,
      //   }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      {/** main board */}
      <BoardContainer>
        <SortableContext items={columnsId}>
          {/** List of columns */}
          {cols.map((col: any) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={col?.tasks} // .filter((task) => task.columnId === col.id)
            />
          ))}

          {/** Add New Cols */}
          <div className=" w-[350px] max-w-full">
            {<EmptyColumn newPos={cols.length} boardId={boardId} />}
          </div>
        </SortableContext>
      </BoardContainer>

      {/** overlay */}
      {"document" in window &&
        createPortal(
          <DragOverlay>
            {/** 1- for dragging column  */}
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={activeColumn.tasks}
              />
            )}
            {/** 2- for dragging task */}
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

    const activeColumnIndex = cols.findIndex((col) => col.id === activeId);
    const overColumnIndex = cols.findIndex((col) => col.id === overId);
    const newCols = arrayMove(cols, activeColumnIndex, overColumnIndex);
    setCols(newCols);

    // await updateColsPositions({ newCols: newCols, boardId });
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
        const activeColumn = cols.find((col) => col.id === activeTask.columnId);

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
          setcolTasks(newTasks, activeColumn!);

          // 1- delete task from active col
          // await updateColTaskPositions({
          //   newColTasks: newTasks,
          //   columnId: activeColumn?.id!,
          //   updateType: "active",
          // });
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
          const activeColumn = cols.find(
            (col) => col.id === activeTask.columnId
          );
          const overColumn = cols.find((col) => col.id === overTask.columnId);

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

            setcolTasks(oldActiveTasks!, activeColumn!);
            setcolTasks(oldOverTasks!, overColumn!);

            // update active col tasks
            // await updateColTaskPositions({
            //   newColTasks: oldActiveTasks!,
            //   columnId: activeColumn?.id!,
            //   updateType: "active",
            // });

            // 2- add task to new over col
            // await updateColTaskPositions({
            //   newColTasks: oldOverTasks!,
            //   columnId: overColumn?.id!,
            //   updateType: "over",
            // });
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
