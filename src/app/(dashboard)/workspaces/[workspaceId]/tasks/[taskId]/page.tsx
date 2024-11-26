import ProjectTitle from "@/components/tasks/project-title";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@radix-ui/react-avatar";
import { ArrowRight, ChevronRight, Pencil, Trash2 } from "lucide-react";
import React from "react";

interface TaskPageProps {
  params: {
    taskId: string;
  };
}

const TaskPage = async ({ params }: TaskPageProps) => {
  // TODO:: Load task details accordingly >> project name and task name

  return (
    <div className="mt-4">
      {/** Project > TaskName */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProjectTitle title="Website Redesign" className="text-gray-500" />
          <ChevronRight className="w-4 h-4" />
          <p className="text-sm font-medium">Write Content For Main Page</p>
        </div>

        <Button variant={"destructive"} className="h-7">
          {" "}
          {/** TODO:: This is confirmation model */}
          <Trash2 className="w-h h-4" />
          Delete Task
        </Button>
      </div>

      <Separator className="my-3" />

      <div className="flex items-center gap-2 w-ful mt-5">
        {/** Overview */}
        <div className="flex-1 bg-gray-100 rounded-md p-4 h-[180px]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Overview</p>
            <Button
              variant={"secondary"}
              className="bg-white hover:bg-white/50 transition-all delay-75 shadow-none"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          </div>
          <Separator className="my-2" />
          <div className="flex flex-col gap-3">
            {/** Assignee */}
            <div className="flex items-center gap-9">
              <p className="text-gray-500 text-sm">Assignee</p>
              <div className="flex items-center gap-1">
                <Avatar className="bg-gray-300 text-xs h-5 w-5 rounded-full flex items-center justify-center mr-1">
                  A
                </Avatar>
                <p className="text-sm">Anotonio</p>
              </div>
            </div>

            {/** DueDate */}
            <div className="flex items-center gap-9">
              <p className="text-gray-500 text-sm">Due Date</p>
              <div className="flex items-center gap-9">
                <p className="text-sm text-orange-500">October 8th, 2024</p>
              </div>
            </div>

            {/** Status */}
            <div className="flex items-center gap-9">
              <p className="text-gray-500 text-sm mr-4">Status</p>
              <Avatar className="bg-blue-500 text-white rounded-md text-xs px-2 py-[3px]">
                In Review
              </Avatar>
            </div>
          </div>
        </div>

        {/** Description */}
        <div className="flex-1 bg-white  border rounded-md  h-[180px] p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Description</p>
            <Button
              variant={"secondary"}
              className=" transition-all delay-75 shadow-none"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          </div>
          <Separator className="my-2" />
          <div className="flex flex-col gap-2">
            <div className="mt-2 text-sm">
              {" "}
              {/** TODO:: this is a text are to update task description */}
              This is a task for website Redesign
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
