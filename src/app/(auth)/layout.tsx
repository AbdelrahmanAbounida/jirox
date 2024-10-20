import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container relative  h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 bg-[url('/auth-bg.jpg')] bg-cover bg-no-repeat text-white dark:border-r lg:flex">
        {/* <img
          src="/auth-bg.jpg"
          className="object-fill"
          // width={100}
          // height={100}
        /> */}
      </div>
      <div className="p-0 h-full lg:p-8">{children}</div>
    </div>
  );
}
