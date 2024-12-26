"use client";
import { redirect } from "next/navigation";

export default function Home() {
  return redirect("/workspaces");
  //   return (
  //     <main className="">
  //       <Button
  //         className=""
  //         onClick={() => {
  //           logout();
  //         }}
  //       >
  //         Logout
  //       </Button>
  //     </main>
  //   );
}
