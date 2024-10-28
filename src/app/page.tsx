"use client";
import { logout } from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="">
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
