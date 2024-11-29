"use client";
import React from "react";
import ProfileDropdown from "./profile-avatar";
import { usePathname } from "next/navigation";
import { NAVBAR_HEADERS } from "@/constants/navbar";

const Navbar = () => {
  const currentPath = usePathname();
  const out = NAVBAR_HEADERS.find((item) =>
    currentPath.includes(item.pathname)
  );
  const title = out?.title;
  const description = out?.description;

  return (
    <div className=" mb-3 w-full px-4 py-1 bg-slate-50 rounded-md">
      <div className="flex w-full items-center justify-between py-2 ">
        {/** title, description  */}
        <div className="flex flex-col ">
          <h1 className="text-lg font-medium">{title}</h1>
          <h1 className="text-sm text-gray-500">{description}</h1>
        </div>

        {/** profile avatar */}
        <ProfileDropdown />
      </div>
    </div>
  );
};

export default Navbar;
