"use client";
import Logo from "@/components/logo";
import { SIDEBAR_ITEMS } from "@/constants/sidebar";
import React from "react";
import SidebarItem from "./sidebar-item";
import WorkspacesSwitcher from "./workspaces-switcher";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ProjectsList from "./projects-list";
import NewProjectModal from "@/components/modals/new-project-modal";
import NewWorkspaceModal from "@/components/modals/new-ws-modal";

const Sidebar = ({ workspaceId }: { workspaceId: string }) => {
  return (
    <aside className="w-64 bg-gray-100 fixed h-full top-0 left-0 p-3">
      <Logo className="my-3 mx-auto h-11 w-32" />

      {/** New Workspace */}
      <div className="flex w-full items-center justify-between border-t pt-2 mt-5">
        <p className="text-gray-500 uppercase text-xs">Workspaces</p>

        <NewWorkspaceModal>
          <Button variant={"ghost"} size={"icon"}>
            <PlusCircle size={22} />
          </Button>
        </NewWorkspaceModal>
      </div>
      <div className="border-b my-1  pb-3">
        <WorkspacesSwitcher workspaceId={workspaceId} />
      </div>
      {/* <DottedLine /> */}

      <div className="my-3 flex flex-col gap-2 ">
        {SIDEBAR_ITEMS.map((item, index) => (
          <SidebarItem
            {...item}
            href={`/workspaces/${workspaceId}${item.href}`}
            key={index}
          />
        ))}
      </div>
      {/** New Project */}
      <div className="flex w-full items-center justify-between border-t pt-2 mt-5">
        <p className="text-gray-500 uppercase text-xs">Projects</p>

        <NewProjectModal workspaceId={workspaceId}>
          <Button variant={"ghost"} size={"icon"}>
            <PlusCircle size={22} />
          </Button>
        </NewProjectModal>
      </div>

      {/** TODO:: add list of projects */}
      <ProjectsList workspaceId={workspaceId} />
    </aside>
  );
};

export default Sidebar;
