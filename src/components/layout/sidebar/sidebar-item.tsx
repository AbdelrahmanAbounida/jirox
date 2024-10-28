"use client";
import React from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SidebarItemProps {
  title: string;
  icon: LucideIcon;
  href: string;
}
const SidebarItem = ({ title, icon, href }: SidebarItemProps) => {
  const currentPath = usePathname();
  const Icon = icon;
  const isActive = currentPath == href;
  return (
    <Link
      href={href}
      className={cn(
        "w-full flex items-center  text-gray-500 gap-2 rounded-md p-2 hover:bg-white",
        isActive && "bg-white"
      )}
    >
      <Icon className="text-black" size={16} />
      <p className={cn("text-sm ", isActive && "font-bold ")}>{title}</p>
    </Link>
  );
};

export default SidebarItem;
