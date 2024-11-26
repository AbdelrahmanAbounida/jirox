import { redirect } from "next/navigation";
import React from "react";

const Workspaces = () => {
  //TODO:: redirect to first workspace or create new workspace (first one )
  return redirect("/workspaces/123");
};

export default Workspaces;
