import InfoCard from "@/components/home/info-card";
import PeopleCard from "@/components/home/people-card";
import RecentTasksCard from "@/components/home/recent-tasks-card";
import { TasksChart } from "@/components/home/tasks-chart";
import {
  ClipboardList,
  ListCheck,
  ListTodo,
  SquareChartGantt,
} from "lucide-react";
import React from "react";

// TODO:: redirect to /workspaces/workspaceId if user has workspaces else redirect to /workspaces/create
// TODO:: any new create will be in a modal
const DashboardHome = async () => {
  return (
    <div className="flex flex-col gap-6 p-4 h-full  box-border ">
      {/** List of cards */}
      <DashCards />

      {/** Flex */}
      {/**
       * 1- Assigned Tasks
       * 2- Projects List
       */}

      <div className="flex items-start gap-2 h-full flex-wrap">
        {/** Tasks Chart >> TODO, Completed */}
        <div className="  h-full flex-1 min-w-[500px]">
          <TasksChart />
        </div>
        {/** Recent Tasks  */}
        <div className="  h-full flex-1 min-w-[500px]">
          <RecentTasksCard />
        </div>
      </div>

      {/** Flex */}
      {/**
       * People List
       */}
      <div className="flex items-center gap-4 pb-9">
        <div className="flex-1 ">
          <PeopleCard />
        </div>
        <div className="flex-1" />
      </div>
    </div>
  );
};

export default DashboardHome;

const DashCards = () => (
  <div className="w-full flex flex-wrap items-center gap-5">
    <InfoCard
      title="Total Projects"
      icon={
        <SquareChartGantt
          size={22}
          className="bg-indigo-500  bg-gradient-radial from-indigoteal-600 text-white h-10  w-10 p-2 rounded-full"
        />
      }
      incrementValue={-3}
      value={3}
    />

    <InfoCard
      title="Total Tasks"
      icon={
        <ClipboardList className="bg-orange-500  bg-gradient-radial from-orange-600 text-white h-10  w-10 p-[0.6rem] rounded-full" />
      }
      incrementValue={5}
      value={3}
    />
    <InfoCard
      title="Assigned Tasks"
      icon={
        <ListTodo
          size={22}
          className="bg-teal-500 bg-gradient-radial from-teal-600 text-white h-10  w-10 p-2 rounded-full"
        />
      }
      incrementValue={-4}
      value={3}
    />
    <InfoCard
      title="Completed Tasks"
      icon={
        <ListCheck
          size={22}
          className="bg-red-500  bg-gradient-radial from-red-800 text-white h-10  w-10 p-2 rounded-full"
        />
      }
      incrementValue={7}
      value={3}
    />
  </div>
);
