"use client";
import DottedLine from "@/components/dotted-line";
import Logo from "@/components/logo";
import { SIDEBAR_ITEMS } from "@/constants/sidebar";
import React from "react";
import SidebarItem from "./sidebar-item";
import WorkspacesSwitcher from "./workspaces-switcher";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-100 fixed h-full top-0 left-0 p-3">
      <Logo className="my-3 mx-auto h-11 w-32" />

      {/** New Workspace */}
      <div className="flex w-full items-center justify-between border-t pt-2 mt-5">
        <p className="text-gray-500 uppercase text-xs">Workspaces</p>

        <Button variant={"ghost"} size={"icon"}>
          <PlusCircle size={22} />
        </Button>
      </div>
      <div className="border-b my-1  pb-3">
        <WorkspacesSwitcher />
      </div>
      {/* <DottedLine /> */}

      <div className="my-3 flex flex-col gap-2 ">
        {SIDEBAR_ITEMS.map((item, index) => (
          <SidebarItem {...item} key={index} />
        ))}
      </div>
      {/* <DottedLine /> */}

      {/** New Project */}
      <div className="flex w-full items-center justify-between border-t pt-2 mt-5">
        <p className="text-gray-500 uppercase text-xs">Projects</p>

        <Button variant={"ghost"} size={"icon"}>
          <PlusCircle size={22} />
        </Button>
      </div>

      {/** TODO:: add list of projects */}
    </aside>
  );
};

export default Sidebar;
