import React from "react";
import KanbanBoard from "./board";
import { Task } from "@/types/task";

const TasksKanban = ({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId?: string;
}) => {
  // const cols = [
  //   {
  //     id: "col1",
  //     boardId: "board1",
  //     title: "To Do",
  //     position: 0,
  //     tasks: [
  //       {
  //         id: "task1435",
  //         title: "Set up project environment",
  //         description:
  //           "Install necessary dependencies and configure the environment.",
  //         position: 0,
  //         columnId: "col1",
  //         comments: [],
  //         activities: [],
  //       },
  //       {
  //         id: "task21241",
  //         title: "Define database schema",
  //         description: "Create models for columns and tasks using Prisma.",
  //         position: 1,
  //         columnId: "col1",
  //         comments: [],
  //         activities: [],
  //       },
  //       {
  //         id: "task232",
  //         title: "Define database schema",
  //         description: "Create models for columns and tasks using Prisma.",
  //         position: 1,
  //         columnId: "col1",
  //         comments: [],
  //         activities: [],
  //       },
  //       {
  //         id: "task2222",
  //         title: "Define database schema",
  //         description: "Create models for columns and tasks using Prisma.",
  //         position: 1,
  //         columnId: "col1",
  //         comments: [],
  //         activities: [],
  //       },
  //       {
  //         id: "task777",
  //         title: "Define database schema",
  //         description: "Create models for columns and tasks using Prisma.",
  //         position: 1,
  //         columnId: "col1",
  //         comments: [],
  //         activities: [],
  //       },
  //     ],
  //     createdAt: "2024-11-24T00:00:00.000Z",
  //     updatedAt: "2024-11-24T00:00:00.000Z",
  //   },
  //   {
  //     id: "col2",
  //     boardId: "board1",
  //     title: "In Progress",
  //     position: 1,
  //     tasks: [
  //       {
  //         id: "task3",
  //         title: "Implement authentication",
  //         description: "Build login and signup functionalities.",
  //         position: 0,
  //         columnId: "col2",
  //         comments: [],
  //         activities: [],
  //       },
  //       {
  //         id: "task4",
  //         title: "Design API routes",
  //         description: "Define REST or GraphQL endpoints for the application.",
  //         position: 1,
  //         columnId: "col2",
  //         comments: [],
  //         activities: [],
  //       },
  //     ],
  //     createdAt: "2024-11-24T00:00:00.000Z",
  //     updatedAt: "2024-11-24T00:00:00.000Z",
  //   },
  //   {
  //     id: "col3",
  //     boardId: "board1",
  //     title: "Done",
  //     position: 2,
  //     tasks: [
  //       {
  //         id: "task5",
  //         title: "Write project documentation",
  //         description: "Document the setup and usage of the project.",
  //         position: 0,
  //         columnId: "col3",
  //         comments: [],
  //         activities: [],
  //       },
  //       {
  //         id: "task6",
  //         title: "Deploy to production",
  //         description: "Deploy the application to the cloud.",
  //         position: 1,
  //         columnId: "col3",
  //         comments: [],
  //         activities: [],
  //       },
  //     ],
  //     createdAt: "2024-11-24T00:00:00.000Z",
  //     updatedAt: "2024-11-24T00:00:00.000Z",
  //   },

  //   {
  //     id: "col4",
  //     boardId: "board1",
  //     title: "To Do",
  //     position: 0,
  //     tasks: [
  //       {
  //         id: "task6",
  //         title: "Set up project environment",
  //         description:
  //           "Install necessary dependencies and configure the environment.",
  //         position: 0,
  //         columnId: "col4",
  //         comments: [],
  //         activities: [],
  //       },
  //       {
  //         id: "task7",
  //         title: "Define database schema",
  //         description: "Create models for columns and tasks using Prisma.",
  //         position: 1,
  //         columnId: "col4",
  //         comments: [],
  //         activities: [],
  //       },
  //     ],
  //     createdAt: "2024-11-24T00:00:00.000Z",
  //     updatedAt: "2024-11-24T00:00:00.000Z",
  //   },
  //   {
  //     id: "col5",
  //     boardId: "board1",
  //     title: "To Do",
  //     position: 0,
  //     tasks: [
  //       {
  //         id: "task66",
  //         title: "Set up project environment",
  //         description:
  //           "Install necessary dependencies and configure the environment.",
  //         position: 0,
  //         columnId: "col4",
  //         comments: [],
  //         activities: [],
  //       },
  //       {
  //         id: "task77",
  //         title: "Define database schema",
  //         description: "Create models for columns and tasks using Prisma.",
  //         position: 1,
  //         columnId: "col5",
  //         comments: [],
  //         activities: [],
  //       },
  //     ],
  //     createdAt: "2024-11-24T00:00:00.000Z",
  //     updatedAt: "2024-11-24T00:00:00.000Z",
  //   },
  // ];

  return (
    <div className="overflow-x-auto h-full  w-full ">
      <KanbanBoard workspaceId={workspaceId} projectId={projectId} />
    </div>
  );
};

export default TasksKanban;
