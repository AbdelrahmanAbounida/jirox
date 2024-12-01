"use client";
import MainButton from "@/components/main-btn";
import ProjectTitle from "@/components/tasks/project-title";
import AssigneeViewer from "@/components/tasks/tasks-table/utils/assignee-viewer";
import DuedateViewer from "@/components/tasks/tasks-table/utils/duedate-viewer";
import { StatusAvatar } from "@/components/tasks/tasks-table/utils/status-avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspaceMembers } from "@/hooks/members/use-workspace-members";
import { useProjectDetails } from "@/hooks/projects/use-project";
import { useTask } from "@/hooks/tasks/use-task";
import { cn } from "@/lib/utils";
import { Task, TaskWithWorkspaceId } from "@/types/task";
import { ChevronRight, Loader, Pencil, Trash, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTask } from "@/hooks/tasks/use-update-task";
import { updateTask } from "@/services/tasks/update-task";
import { toast } from "sonner";
import { mutate } from "swr";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TaskEnum } from "@/constants/enums";
import ConfirmDeleteModal from "@/components/modals/confirm-delete-modal";
import { useRouter } from "next/navigation";
import { checkResponseError, handleDeleteTask } from "@/utils/task-utils";

interface PageParams {
  params: {
    taskId: string;
    projectId: string;
    workspaceId: string;
  };
}

const TaskPage = ({ params }: PageParams) => {
  const router = useRouter();
  const [updateLoading, setupdateLoading] = useState(false);
  const { data: currentProject, isLoading } = useProjectDetails({
    projectId: params.projectId,
  });
  const { data: currentTask, isLoading: LoadingTask } = useTask(params.taskId);

  const [editingTask, seteditingTask] = useState({
    overview: false,
    description: false,
  });

  const {
    loadTask,
    taskLoaded,
    description: updatedTaskDescription,
    setDescription: setupdatedTaskDescription,
    status: updatedTaskStatus,
    dueDate: updatedTaskDuedate,
    assingeeId: updatedAssigneeId,
  } = useUpdateTask();

  const handleUpdateTask = async () => {
    if (!currentTask) {
      return;
    }

    try {
      setupdateLoading(true);
      const resp = await updateTask({
        ...currentTask,
        taskId: currentTask.id,
        description: updatedTaskDescription,
        status: updatedTaskStatus,
        dueDate: updatedTaskDuedate!,
        assigneeId: updatedAssigneeId,
      });
      checkResponseError({
        resp,
        errorMessage: "Something went wrong while updating this Task",
        successMessage: "Task updated Successfully",
      });
      await mutate(["projectTasks", resp?.projectId]);
      await mutate([currentTask?.id, "task"]);

      seteditingTask({ description: false, overview: false });
    } catch (error) {
      console.log({ error });
      toast.error("Failed to update task");
    } finally {
      setupdateLoading(false);
    }
  };

  useEffect(() => {
    if (!LoadingTask && currentTask && !taskLoaded) {
      loadTask(currentTask);
    }
  }, [currentTask, LoadingTask]);

  return (
    <div className="w-full">
      <div className="flex items-center w-full justify-between px-2">
        {isLoading || LoadingTask ? (
          <Skeleton className="w-[100px] h-7" />
        ) : (
          <div className="flex items-center gap-2">
            <ProjectTitle className="text-lg" title={currentProject?.name!} />
            <ChevronRight className="h-4 w-4" />
            <p className="font-medium text-lg">{currentTask?.name}</p>
          </div>
        )}

        <ConfirmDeleteModal
          title="Delete Task"
          onDelete={async () => {
            await handleDeleteTask({
              task: currentTask!,
              router,
              workspaceId: params.workspaceId,
            });
          }}
        >
          <Button className="h-8 text-sm flex items-center gap-2 rounded-md   p-3 bg-red-600 hover:bg-red-700 shadow-sm transition-all delay-75">
            <Trash className="h-4 w-4 " />
            Delete Task
          </Button>
        </ConfirmDeleteModal>
      </div>

      <div className="flex  items-start gap-7 mt-5 ">
        {/** Overview Card */}
        <div
          className={cn(
            "w-full h-[210px] border flex flex-col flex-1 bg-gray-100 rounded-md p-3",
            editingTask.overview && "bg-white border rouneded-md pb-4 h-[260px]"
          )}
        >
          <div className=" w-full items-center flex justify-between">
            <p className="font-medium">Overview</p>

            {editingTask.overview ? (
              <Button
                onClick={() =>
                  seteditingTask({ ...editingTask, overview: false })
                }
                variant={"outline"}
                className="shadow-none h-8"
              >
                <X className="h-4 w-4 " />
                Cancel
              </Button>
            ) : (
              <Button
                onClick={() =>
                  seteditingTask({ ...editingTask, overview: true })
                }
                variant={"outline"}
                className="shadow-none h-8"
              >
                <Pencil className="h-4 w-4 " />
                Edit
              </Button>
            )}
          </div>
          <Separator className="my-3" />

          <div className=" flex-1 flex-col gap-3">
            {/** Assignee */}
            <TaskAssigneeView
              workspaceId={params.workspaceId}
              currentTask={currentTask!}
              editingOverview={editingTask.overview}
            />

            {/** Duedate */}
            <TaskDueDateView
              workspaceId={params.workspaceId}
              currentTask={currentTask!}
              editingOverview={editingTask.overview}
            />

            {/** Status */}
            <TaskStatusViewer
              workspaceId={params.workspaceId}
              currentTask={currentTask!}
              editingOverview={editingTask.overview}
            />

            {editingTask.overview && (
              <SaveButton
                updateLoading={updateLoading}
                handleUpdateTask={handleUpdateTask}
              />
            )}
          </div>
        </div>

        {/** Description Card */}
        <div
          className={cn(
            "w-full border min-h-[210px] flex flex-col flex-1 bg-gray-100 rounded-md p-3",
            editingTask.description && "bg-white border rouneded-md"
          )}
        >
          <div className="w-full flex items-center justify-between">
            <p className="font-medium">Description</p>
            {editingTask.description ? (
              <Button
                onClick={() =>
                  seteditingTask({ ...editingTask, description: false })
                }
                variant={"outline"}
                className="shadow-none h-8"
              >
                <X className="h-4 w-4 " />
                Cancel
              </Button>
            ) : (
              <Button
                onClick={() =>
                  seteditingTask({ ...editingTask, description: true })
                }
                variant={"outline"}
                className="shadow-none h-8"
              >
                <Pencil className="h-4 w-4 " />
                Edit
              </Button>
            )}
          </div>
          <Separator className="my-3" />

          {/** description */}
          {editingTask.description ? (
            <div className="flex flex-col items-start gap-2 pb-1">
              <Textarea
                className="mb-2 placeholder:text-gray-500"
                rows={4}
                placeholder="Update the task description"
                value={updatedTaskDescription}
                onChange={(e) => {
                  setupdatedTaskDescription(e.target.value!);
                }}
              />
              <SaveButton
                updateLoading={updateLoading}
                handleUpdateTask={handleUpdateTask}
              />
            </div>
          ) : (
            <div className="h-[125px]">
              {updatedTaskDescription ? (
                <p className="text-sm">{updatedTaskDescription}</p>
              ) : !currentTask ? (
                <Skeleton className="w-[70%] h-4" />
              ) : (
                <p className="text-gray-500 text-sm">
                  This is your task description
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;

interface TaskProps {
  currentTask: Task & { assigneeEmail: string };
  editingOverview: boolean;
  workspaceId: string;
}

const TaskAssigneeView = ({
  workspaceId,
  currentTask,
  editingOverview,
}: TaskProps) => {
  const { data: workspaceMembers, isLoading: LoadingMembers } =
    useWorkspaceMembers({
      workspaceId: workspaceId,
    });
  const { assigneeEmail, setAssigneeEmail, assingeeId, setAssigneeId } =
    useUpdateTask();

  return (
    <div className="flex items-center gap-11 text-sm">
      {currentTask ? (
        <p className="text-gray-500">Assignee</p>
      ) : (
        <Skeleton className="w-[70px] h-7" />
      )}
      {!currentTask ? (
        <Skeleton className="w-[210px] h-7" />
      ) : editingOverview ? (
        <div className="gap-2 flex items-center w-full">
          <Select
            value={assingeeId}
            onValueChange={setAssigneeId}
            defaultValue={currentTask.assigneeId}
            disabled={LoadingMembers}
          >
            <SelectTrigger
              className="w-full max-w-[200px] h-8"
              disabled={LoadingMembers}
            >
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {workspaceMembers?.map((member, index) => (
                <SelectItem key={index} value={member.userId}>
                  {member.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="gap-2 flex items-center">
          {currentTask?.assigneeEmail && (
            <AssigneeViewer
              assignee={currentTask?.assigneeEmail!}
              className=" pl-0 flex justify-start"
            />
          )}
        </div>
      )}
    </div>
  );
};

const TaskDueDateView = ({ currentTask, editingOverview }: TaskProps) => {
  const { dueDate, setdueDate } = useUpdateTask();

  return (
    <div className="flex items-center gap-11 text-sm my-3 mt-5 font-medium">
      {currentTask ? (
        <p className="text-gray-500">Due Date</p>
      ) : (
        <Skeleton className="w-[70px] h-7" />
      )}

      {!currentTask ? (
        <Skeleton className="w-[210px] h-3" />
      ) : editingOverview ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                " pl-3 text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full max-w-md md:max-w-lg lg:max-w-xl p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={dueDate ? new Date(dueDate) : undefined}
              onSelect={(date) => setdueDate(date!)}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      ) : (
        <DuedateViewer date={currentTask?.dueDate?.toString()!} />
      )}
    </div>
  );
};

const TaskStatusViewer = ({ currentTask, editingOverview }: TaskProps) => {
  const { status, setStatus } = useUpdateTask();

  return (
    <div className="flex items-center gap-11 text-sm pt-2">
      {!currentTask ? (
        <Skeleton className="w-[70px] h-3" />
      ) : (
        <p className="text-gray-500 pr-4">Status</p>
      )}

      {!currentTask ? (
        <Skeleton className="w-[210px] h-3" />
      ) : editingOverview ? (
        <Select onValueChange={setStatus} defaultValue={status}>
          <SelectTrigger className="max-w-[210px]">
            <SelectValue placeholder="" />
          </SelectTrigger>

          <SelectContent>
            {Object.entries(TaskEnum).map(([key, val], index) => (
              <SelectItem key={index} value={key.toString()}>
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <StatusAvatar status={currentTask?.status!} />
      )}
    </div>
  );
};

const SaveButton = ({
  updateLoading,
  handleUpdateTask,
}: {
  updateLoading: boolean;
  handleUpdateTask: any;
}) => {
  return (
    <div className="w-full flex items-center justify-end ">
      {updateLoading ? (
        <MainButton disabled={true} className="place-self-end px-4 ">
          <Loader className="animate-spin w-4 h-4" />
          Loading
        </MainButton>
      ) : (
        <MainButton onClick={handleUpdateTask} className="place-self-end px-4 ">
          Save Changes
        </MainButton>
      )}
    </div>
  );
};

// *********** Utils *****************
