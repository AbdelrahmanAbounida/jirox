import { redirect } from "next/navigation";
import React from "react";

export interface WorkspacePageParams {
  params: {
    workspaceId: string;
  };
}

const WorkspacePage = ({ params }: WorkspacePageParams) => {
  return redirect(`/workspaces/${params.workspaceId}/home`); // TODO:: load first project id in ws and redirect for or redirect to create new project
};

export default WorkspacePage;
