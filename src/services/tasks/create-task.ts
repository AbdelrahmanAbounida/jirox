import apiClient from "@/lib/api-client";

// TODO:: pass the task items
export const createTask = async ({
  content,
  stars,
}: {
  content: string;
  stars: number;
}) => {
  const task = await apiClient({
    endpoint: "/tasks/create",
    method: "POST",
    body: {
      content,
      stars,
    },
  });

  return task;
};
