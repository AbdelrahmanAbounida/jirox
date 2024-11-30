"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { DataTableColumnHeader } from "./column-header";
import { Task } from "@/types/task";
import { TaskEnum } from "@/constants/enums";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { StatusAvatar } from "./status-avatar";
import ProjectTitle from "../project-title";
import { Member } from "@/types/members";

export const TaskColumns: ColumnDef<Task>[] = [
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
      return (
        <div className="flex items-center gap-2">
          <StatusAvatar status={status} />
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
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
