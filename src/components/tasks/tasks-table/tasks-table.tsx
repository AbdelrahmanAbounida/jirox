import React, { useMemo } from "react";
import { DataTable } from "./data-table";

const TasksTable = () => {
  const defaultData: any[] = [];
  const data = useMemo(() => defaultData, []);
  return (
    <div className="p-5 h-full  rounded-lg">
      {/** TODO:: Tasks Table */}
      <DataTable data={[]} />
    </div>
  );
};

export default TasksTable;
