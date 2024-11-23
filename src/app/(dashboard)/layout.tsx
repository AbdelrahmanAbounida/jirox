import Navbar from "@/components/layout/navbar/navbar";
import Sidebar from "@/components/layout/sidebar/sidebar";
import NextTopLoader from "nextjs-toploader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start w-full  h-full">
      {/**sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="md:pl-72   w-full">
        <div className="flex flex-col gap-1 p-2">
          <div className="w-full">
            <NextTopLoader color="blue" speed={300} />
          </div>
          <Navbar />
          <div className="p-4 flex flex-col gap-3 max-w-9xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
