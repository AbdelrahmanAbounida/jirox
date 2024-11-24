import Navbar from "@/components/layout/navbar/navbar";
import Sidebar from "@/components/layout/sidebar/sidebar";
import NextTopLoader from "nextjs-toploader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start w-full h-screen">
      {/** Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/** Main Content */}
      <div className="flex flex-col w-full h-full md:pl-72 p-3 box-border">
        <div className="w-full">
          <NextTopLoader color="blue" speed={300} />
        </div>
        <Navbar />
        <div className="w-full flex-grow ">{children}</div>
      </div>
    </div>
  );
}
