import React, { useMemo } from "react";
import { DataTable } from "./data-table";
import { Task } from "@/types/task";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const TasksTable = ({
  workspaceTasks,
  isLoading,
}: {
  workspaceTasks: Task[];
  isLoading: boolean;
}) => {
  const data = useMemo(() => workspaceTasks, [workspaceTasks, isLoading]);

  return (
    <div className="p-5 h-full  rounded-lg">
      {isLoading ? <TableSkeleton /> : <DataTable data={data} />}
    </div>
  );
};

export default TasksTable;

const TableSkeleton = ({
  rows = 5,
  columns = 3,
}: {
  rows?: number;
  columns?: number;
}) => {
  return (
    <Table className="">
      <TableHeader>
        <TableRow>
          {[...Array(4)].map((_, index) => (
            <TableHead key={index}>
              <Skeleton className="h-5 w-[100px]" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {[...Array(4)].map((_, cellIndex) => (
              <TableCell key={cellIndex}>
                <Skeleton className="h-5 w-[100px]" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
