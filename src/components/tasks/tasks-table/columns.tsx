"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Pencil,
  SquareArrowOutUpRight,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { DataTableColumnHeader } from "./column-header";
import { Task, TaskWithWorkspaceId } from "@/types/task";
import { TaskEnum } from "@/constants/enums";
import ProjectTitle from "../project-title";
import EditTaskModal from "@/components/modals/edit-task-modal";
import Link from "next/link";
import DuedateViewer from "./utils/duedate-viewer";
import AssigneeViewer from "./utils/assignee-viewer";
import ConfirmDeleteModal from "@/components/modals/confirm-delete-modal";
import { handleDeleteTask } from "@/utils/task-utils";
import { useRouter } from "next/navigation";

export const TaskColumns: ColumnDef<TaskWithWorkspaceId>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task Name" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("name") as string;
      return <div className=" ">{title}</div>;
    },
  },
  {
    accessorKey: "projectName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Project"
        className=" items-center text-center justify-center"
      />
    ),
    cell: ({ row }) => {
      const project = row.getValue("projectName") as string;
      return <ProjectTitle title={project} />;
    },
  },
  {
    accessorKey: "assigneeEmail",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Assignee"
        className=" items-center text-center justify-center"
      />
    ),
    cell: ({ row }) => {
      const assignee = row.getValue("assigneeEmail") as string;
      return <AssigneeViewer assignee={assignee} />;
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as string;
      return <DuedateViewer date={date} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }: any) => {
      const status = row.getValue("status") as TaskEnum;

      let statusColor = "bg-gray-300";
      switch (status) {
        case TaskEnum.BACKLOG:
          statusColor = "bg-red-500";
          break;
        case TaskEnum.INPROGRESS:
          statusColor = "bg-yellow-500";
          break;
        case TaskEnum.INREVIEW:
          statusColor = "bg-blue-500";
          break;
        case TaskEnum.TODO:
          statusColor = "bg-purple-500";
          break;
        case TaskEnum.DONE:
          statusColor = "bg-green-500";
          break;
      }

      return (
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full  lowercase ${statusColor}`}
            title={status}
          ></div>
          <span className="font-medium lowercase ">{status}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original;
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="">
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4 ring-0 focus:ring-0" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[170px]">
            <DropdownMenuGroup className="gap-1 flex flex-col ">
              <DropdownMenuItem>
                <Link
                  href={`/workspaces/${task.workspaceId}/projects/${task.projectId}/tasks/${task.id}`}
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <SquareArrowOutUpRight className="h-4 w-4" />
                  <span className="">Task Details</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link
                  className="flex items-center gap-2"
                  href={`/workspaces/${task.workspaceId}/projects/${task.projectId}`}
                  target="_blank"
                >
                  <SquareArrowOutUpRight className="h-4 w-4 ring-0 focus:ring-0" />
                  <span className="">Open Project</span>
                </Link>
              </DropdownMenuItem>

              <EditTaskModal taskId={task.id} workspaceId={task.workspaceId}>
                <div className="flex items-center gap-2 hover:bg-slate-100 p-[5px] rounded-md pl-2 ">
                  <Pencil className="h-4 w-4 ring-0 focus:ring-0 mr-1" />
                  <span className="text-sm">Edit Task</span>
                </div>
              </EditTaskModal>
              <DropdownMenuSeparator className="h-[1px] bg-gray-200 " />

              <ConfirmDeleteModal
                onDelete={async () => {
                  await handleDeleteTask({
                    task,
                    workspaceId: task.workspaceId,
                    router,
                  });
                }}
              >
                <div className="flex items-center gap-2 text-sm p-1 pl-2 text-red-500 hover:bg-red-50 hover:text-red-600">
                  <Trash className="h-4 w-4 ring-0 focus:ring-0 " />
                  <span className="">Delete Task</span>
                </div>
              </ConfirmDeleteModal>

              {/* <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-500">
                
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
