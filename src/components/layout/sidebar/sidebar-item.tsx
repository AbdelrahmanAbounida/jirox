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
        "w-full flex items-center  text-gray-600 gap-2 group rounded-md p-2 hover:bg-gray-50",
        isActive && "bg-white hover:bg-white"
      )}
    >
      <Icon
        className={cn(
          "text-sm text-gray-700 group-hover:text-blue-600",
          isActive && "font-medium text-blue-600 "
        )}
        size={16}
      />
      <p
        className={cn(
          "text-sm group-hover:text-blue-600",
          isActive && "font-medium text-blue-600 "
        )}
      >
        {title}
      </p>
    </Link>
  );
};

export default SidebarItem;
