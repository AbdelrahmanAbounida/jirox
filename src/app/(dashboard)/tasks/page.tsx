import MainButton from "@/components/main-btn";
import TasksCalendar from "@/components/tasks/tasks-calendar";
import TasksKanban from "@/components/tasks/tasks-kanban/tasks-kanban";
import TasksTable from "@/components/tasks/tasks-table/tasks-table";
import TasksTabs from "@/components/tasks/tasks-tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksFilters from "@/components/tasks/tasks-filters";

const Tasks = () => {
  return (
    <div className="border rounded-lg flex flex-col h-full">
      <Tabs defaultValue="table" className="flex flex-col flex-grow h-full">
        {/** Header */}
        <div className="flex items-center justify-between p-3">
          <TabsList className="w-[230px]">
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          {/** New Task Button */}
          <MainButton>
            <PlusIcon className="text-white" />
            New
          </MainButton>
        </div>

        {/** Separator */}
        <Separator />

        {/** Filters */}
        <div className=" pt-4 w-full px-3 mb-5">
          <TasksFilters />
        </div>

        {/** Tabs Content */}
        <TabsContent value="table" className="w-full h-full">
          <TasksTable />
        </TabsContent>
        <TabsContent value="kanban" className="w-full h-full  ">
          <TasksKanban />
        </TabsContent>
        <TabsContent value="calendar" className="w-full h-full">
          <TasksCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
