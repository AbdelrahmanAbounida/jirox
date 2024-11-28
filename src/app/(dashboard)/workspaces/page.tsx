import { getAllWorkspaces } from "@/services/workspaces/get-workspaces";
import { redirect } from "next/navigation";

const Workspaces = async () => {
  //TODO:: redirect to first workspace or create new workspace (first one )

  const userWorkspaces = await getAllWorkspaces();
  if (!userWorkspaces || userWorkspaces?.length == 0) {
    return redirect("/workspaces/create");
  } else {
    return redirect(`/workspaces/${userWorkspaces[0].id}/home`);
  }
};

export default Workspaces;
