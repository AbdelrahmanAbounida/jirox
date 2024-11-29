"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { logout } from "@/actions/auth/logout";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";

const ProfileDropdown = () => {
  const session = useSession();
  const user = session.data?.user;
  const status = session.status;
  const [currentUser, setcurrentUser] = useState<any>(user);

  useEffect(() => {
    if (user && !currentUser) {
      setcurrentUser(user);
    }
  }, [user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        {status == "loading" ? (
          <Skeleton className="w-[40px] h-[40px] rounded-full" />
        ) : (
          <Avatar className="rounded-lg">
            {currentUser?.image && <AvatarImage src={currentUser.image} />}
            <AvatarFallback>
              <span
                className={
                  currentUser?.image
                    ? ""
                    : "bg-blue-500 uppercase w-full h-full text-center items-center justify-center flex font-medium text-white"
                }
              >
                {currentUser?.name?.slice(0, 1) ||
                  currentUser?.email?.slice(0, 1)}
              </span>
            </AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{currentUser?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
