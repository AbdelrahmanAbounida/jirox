import React, { useMemo } from "react";
import { DataTable } from "./tasks-table/data-table";

const TasksTable = () => {
  const defaultData: any[] = [];
  const data = useMemo(() => defaultData, []);
  return (
    <div className="p-5 border  rounded-lg">
      {/** TODO:: Tasks Table */}
      <DataTable data={[]} />
    </div>
  );
};

export default TasksTable;
