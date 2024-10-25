"use client";
import { logout } from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      as
      <Button
        className=""
        onClick={() => {
          logout();
        }}
      >
        Logout
      </Button>
    </main>
  );
}
