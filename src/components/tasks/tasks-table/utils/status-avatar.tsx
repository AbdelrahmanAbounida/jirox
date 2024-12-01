import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  RefreshCcw,
  FileQuestion,
} from "lucide-react";
import { TaskEnum } from "@/constants/enums";

// Mapping of status to avatar configurations
const STATUS_CONFIG = {
  [TaskEnum.BACKLOG]: {
    icon: FileQuestion,
    className: "bg-gray-50 text-gray-600",
  },
  [TaskEnum.INPROGRESS]: {
    icon: RefreshCcw,
    className: "bg-blue-50 text-blue-600",
  },
  [TaskEnum.INREVIEW]: {
    icon: Clock,
    className: "bg-yellow-50 text-yellow-600",
  },
  [TaskEnum.TODO]: {
    icon: ListTodo,
    className: "bg-purple-100 text-purple-600",
  },
  [TaskEnum.DONE]: {
    icon: CheckCircle2,
    className: "bg-green-50 text-green-600",
  },
};

interface StatusAvatarProps {
  status: TaskEnum;
  className?: string;
}

export const StatusAvatar: React.FC<StatusAvatarProps> = ({
  status,
  className,
}) => {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <div
      className={cn(
        "w-auto p-1 px-5 bg-transparent rounded-full font-medium text-xs",
        config.className,
        className
      )}
    >
      <span className="capitalize">{status.toLowerCase()}</span>
    </div>
  );
};
