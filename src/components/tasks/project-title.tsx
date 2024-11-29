import { cn } from "@/lib/utils";
import React from "react";
import { Avatar } from "../ui/avatar";
const ProjectTitle = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm justify-center",
        className
      )}
    >
      <Avatar className=" rounded-md uppercase bg-blue-600 text-white flex items-center justify-center h-6 w-6 ">
        {title && title[0]}
      </Avatar>
      <p className="truncate overflow-hidden font-medium">{title}</p>
    </div>
  );
};

export default ProjectTitle;
