import KanbanBoard from "@/components/tasks/tasks-kanban/board";
import React from "react";

const Settings = () => {
  return (
    <div className="h-full bg-red-500 flex flex-col p-3">
      <div className="h-full bg-white p-3 box-border">
        <div className="h-full bg-blue-500 p-3 box-border">
          <KanbanBoard />
        </div>
      </div>
    </div>
  );
};

export default Settings;
