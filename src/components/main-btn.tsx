import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const MainButton = ({
  className,
  children,
  ...props
}: {
  className?: React.HTMLProps<HTMLElement>["className"];
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button
      {...props}
      className={cn(
        "bg-gradient-radial to-blue-700  from-blue-700 h-8  active:scale-95 active:shadow-none transition-transform duration-150",
        className
      )}
    >
      {children}
    </Button>
  );
};

export default MainButton;
