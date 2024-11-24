import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksCalendar from "./tasks-calendar";
import TasksKanban from "./tasks-kanban/tasks-kanban";
import TasksTable from "./tasks-table/tasks-table";

const TasksTabs = () => {
  return (
    <Tabs defaultValue="table" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="table">Table</TabsTrigger>
        <TabsTrigger value="kanban">Kanban</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
      </TabsList>

      <TabsContent value="table">
        <TasksTable />
      </TabsContent>
      <TabsContent value="kanban">
        <TasksKanban />
      </TabsContent>
      <TabsContent value="calendar">
        <TasksCalendar />
      </TabsContent>
    </Tabs>
  );
};

export default TasksTabs;
