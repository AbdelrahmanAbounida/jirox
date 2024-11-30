"use client";
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Avatar } from "../ui/avatar";
import Link from "next/link";
import { Task } from "@/types/task";

// Setup the localizer by providing the moment instance
const localizer = momentLocalizer(moment);

// Sample events
const events = [
  {
    id: 0,
    title: "Project Kickoff Meeting",
    start: new Date(2024, 10, 26, 9, 30, 0),
    end: new Date(2024, 10, 26, 11, 0, 0),
  },
  {
    id: 1,
    title: "Design Review",
    start: new Date(2024, 10, 27, 14, 0, 0),
    end: new Date(2024, 10, 27, 15, 30, 0),
  },
  {
    id: 2,
    title: "Team Lunch",
    start: new Date(2024, 10, 28, 12, 0, 0),
    end: new Date(2024, 10, 28, 13, 0, 0),
  },
];

// Custom components
const CustomMonthCell = ({ children, date }: any) => {
  return (
    <div style={{ padding: "4px", textAlign: "center", background: "#" }}>
      <strong style={{ color: "green" }}>{moment(date).format("D")}</strong>
      {children}
    </div>
  );
};

{
  /** TODO:: This is the main event loaded from db */
}
const CustomEvent = ({ event }: any) => (
  <Link
    href={"/tasks/asd"}
    className="flex flex-col bg-white w-full gap-3 rounded-md border border-l-4 border-l-green-500 h-[80px] p-2 hover:bg-gray-100 transition-all delay-75"
  >
    {" "}
    {/** TODO:: update colors dynamically */}
    <p className="text-sm font-normal text-black">{event.title}</p>
    <div className="flex items-center gap-2 mt-1">
      {/* Replace with actual Avatar component */}
      <div className="rounded-full bg-gray-300 text-gray-600 text-xs w-5 h-5 flex items-center justify-center">
        A
      </div>
      <div className="rounded-full bg-blue-600 text-xs text-white  w-5 h-5 flex items-center justify-center">
        W
      </div>
    </div>
  </Link>
);

const CustomWeekHeader = ({ label }: any) => (
  <div style={{ textAlign: "center", fontWeight: "bold", color: "" }}>
    {label}
  </div>
);

const CustomDayHeader = ({ date }: any) => (
  <div style={{ textAlign: "center", fontWeight: "bold", color: "" }}>
    {moment(date).format("dddd, MMM D")}
  </div>
);

function TasksCalendar({
  workspaceTasks,
  isLoading,
}: {
  workspaceTasks: Task[];
  isLoading: boolean;
}) {
  const [currentView, setCurrentView] = useState(Views.MONTH);

  return (
    <Calendar
      eventPropGetter={(event) => {
        const backgroundColor = event.start ? "white" : "white"; // TODO:: update event according to date
        return {
          style: { backgroundColor },
        };
      }}
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      defaultView="month"
      defaultDate={new Date(2024, 10, 1)}
      views={[Views.MONTH, Views.WEEK, Views.DAY]}
      components={{
        // month: {
        //   dateHeader: CustomMonthCell,
        // },
        // week: {
        //   header: CustomWeekHeader,
        // },
        // day: {
        //   header: CustomDayHeader,
        // },
        event: CustomEvent,
        // toolbar: (props) => <CustomToolbar {...props} />,
      }}
    />
  );
}

const CustomToolbar = ({ label, onNavigate, onView }: any) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
      }}
    >
      <div>
        <button onClick={() => onNavigate("PREV")}>{"<"}</button>
        <span style={{ margin: "0 10px" }}>{label}</span>
        <button onClick={() => onNavigate("NEXT")}>{">"}</button>
      </div>
      <div>
        <button onClick={() => onView("month")}>Month</button>
        <button onClick={() => onView("week")}>Week</button>
        <button onClick={() => onView("day")}>Day</button>
      </div>
    </div>
  );
};

export default TasksCalendar;
