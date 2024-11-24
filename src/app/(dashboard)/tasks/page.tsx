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
    <div className="border rounded-lg h-full flex flex-col">
      <Tabs defaultValue="table" className="flex flex-col flex-grow">
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
        <div className=" pt-4 w-full px-3">
          <TasksFilters />
        </div>

        {/** Tabs Content */}
        <div className="flex-grow overflow-y-hidden">
          <TabsContent value="table" className="w-full h-full mt-6">
            <TasksTable />
          </TabsContent>
          <TabsContent value="kanban" className="w-full h-full  mt-6">
            <TasksKanban />
          </TabsContent>
          <TabsContent value="calendar" className="w-full h-full mt-6">
            <TasksCalendar />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Tasks;
