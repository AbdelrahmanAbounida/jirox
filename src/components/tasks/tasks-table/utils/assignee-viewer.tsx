import { cn } from "@/lib/utils";
import React from "react";

const AssigneeViewer = ({
  assignee,
  className,
}: {
  assignee: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        " min-w-[210px] rounded-lg p-3 flex justify-center items-center",
        className
      )}
    >
      <div className="bg-blue-600 text-white flex items-center justify-center font-semibold rounded-md w-5 h-5 mr-2">
        <span className="capitalize ">{assignee && assignee[0]}</span>
      </div>
      <div className="flex flex-col gap-1 items-start">
        <p className="text-gray-700 text-sm">{assignee}</p>
      </div>
    </div>
  );
};

export default AssigneeViewer;
