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
      return (
        <div className=" min-w-[210px] rounded-lg p-3 flex justify-center items-center">
          <div className="bg-blue-600 text-white flex items-center justify-center font-semibold rounded-md w-5 h-5 mr-2">
            <span className="capitalize ">{assignee && assignee[0]}</span>
          </div>
          <div className="flex flex-col gap-1 items-start">
            <p className="text-gray-700 text-sm">{assignee}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const dueDate = new Date(row.getValue("dueDate"));
      const today = new Date();
      const differenceInDays = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Determine the color based on how near/far the due date is
      let textColor = "text-black";
      if (differenceInDays < 0) {
        textColor = "text-red-500";
      } else if (differenceInDays <= 3) {
        textColor = "text-yellow-500";
      } else if (differenceInDays <= 7) {
        textColor = "text-blue-500";
      } else {
        textColor = "text-green-500";
      }

      return (
        <div className={`text-start font-medium ${textColor}`}>
          {dueDate.toISOString().split("T")[0]}
        </div>
      );
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

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="">
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4 ring-0 focus:ring-0" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[170px]">
            <DropdownMenuGroup className="gap-1 flex flex-col">
              <DropdownMenuItem>
                <SquareArrowOutUpRight className="" />
                <span className="">Task Details</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <SquareArrowOutUpRight className="h-4 w-4 ring-0 focus:ring-0" />
                <span className="">Open Project</span>
              </DropdownMenuItem>

              <EditTaskModal taskId={task.id} workspaceId={task.workspaceId}>
                <div className="flex items-center gap-2 hover:bg-slate-100 p-[5px] rounded-md ">
                  <Pencil className="h-4 w-4 ring-0 focus:ring-0 mr-1" />
                  <span className="text-sm">Edit Task</span>
                </div>
              </EditTaskModal>
              <DropdownMenuSeparator className="h-[1px] bg-gray-200 " />

              <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-500">
                <Trash className="h-4 w-4 ring-0 focus:ring-0 " />
                <span className="">Delete Task</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
