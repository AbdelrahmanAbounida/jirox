import { TaskEnum } from "@/constants/enums";
import { deleteTask } from "@/services/tasks/delete-task";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { mutate } from "swr";

export function mapStatusToEnum(
  status: string | undefined
): TaskEnum | undefined {
  if (!status) return undefined;

  return Object.values(TaskEnum).find(
    (value) => value.toLowerCase() === status.toLowerCase().trim()
  );
}

export const handleDeleteTask = async ({
  task,
  workspaceId,
  router,
}: {
  task: Task;
  workspaceId: string;
  router: any;
}) => {
  try {
    const resp = await deleteTask({ taskId: task?.id! });

    checkResponseError({
      resp,
      errorMessage: "Something went wrong while deleting this Task",
      successMessage: "Task deleted Successfully",
    });
    await mutate(["projectTasks", resp.projectId]);

    await mutate(
      ["projectTasks", resp.projectId],
      async (currentData: any) => {
        return [...currentData];
      },
      true
    );

    router.refresh();
    router.push(`/workspaces/${workspaceId}/tasks`);
  } catch (error) {
    console.log({ error });
    toast.error("Something went wrong while deleting task");
  }
};

export const checkResponseError = ({
  resp,
  errorMessage,
  successMessage,
}: {
  resp: any;
  errorMessage: string;
  successMessage: string;
}) => {
  if (resp?.error || (resp?.statusCode && resp?.statusCode !== 200)) {
    toast.error(resp?.message);
  } else {
    if (!resp) {
      toast.error(errorMessage);
      return;
    }
    toast.success(successMessage);
  }
};
