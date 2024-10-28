import { SidebarItemProps } from "@/components/layout/sidebar/sidebar-item";
import {
  Check,
  CheckCircle,
  CircleCheck,
  Home,
  Settings,
  Users,
} from "lucide-react";

export const SIDEBAR_ITEMS: SidebarItemProps[] = [
  {
    title: "Home",
    icon: Home,
    href: "/home",
  },
  {
    title: "My Tasks",
    icon: CircleCheck,
    href: "/tasks",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "Members",
    icon: Users,
    href: "/members",
  },
];
