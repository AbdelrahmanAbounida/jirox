import MainButton from "@/components/main-btn";
import TasksCalendar from "@/components/tasks/tasks-calendar";
import TasksKanban from "@/components/tasks/tasks-kanban";
import TasksTable from "@/components/tasks/tasks-table";
import TasksTabs from "@/components/tasks/tasks-tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksFilters from "@/components/tasks/tasks-filters";

const Tasks = () => {
  return (
    <div>
      {/** TODO::
       * 1- Tabs >> Table. Kanban , Calendar
       *
       * -- Table
       * -- Kanban
       * -- Calendar
       * 2-
       */}
      <div className="border rounded-lg p-3 h-full">
        <Tabs defaultValue="table" className="h-full ">
          <div className="flex items-center justify-between">
            <TabsList className="w-[230px]">
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>

            {/** TODO:: New Task Modal */}
            <MainButton className="">
              <PlusIcon className="text-white " />
              New
            </MainButton>
          </div>

          <Separator className="my-3" />

          {/** Filters Tabs */}
          <div className="my-3 pt-4 w-full">
            <TasksFilters />
          </div>

          <TabsContent value="table" className="h-full  mt-6">
            <TasksTable />
          </TabsContent>
          <TabsContent value="kanban" className="h-full  mt-6">
            <TasksKanban />
          </TabsContent>
          <TabsContent value="calendar" className="h-full  mt-6">
            <TasksCalendar />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Tasks;
