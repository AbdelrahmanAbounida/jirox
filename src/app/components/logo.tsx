import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href={"/"} className={cn(className)}>
      <img className="" src="/logo.png" width={150} height={150} />
    </Link>
  );
};

export default Logo;
