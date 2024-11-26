import Navbar from "@/components/layout/navbar/navbar";
import Sidebar from "@/components/layout/sidebar/sidebar";
import NextTopLoader from "nextjs-toploader";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    workspaceId: string;
  };
}) {
  return (
    <div className="flex items-start w-full h-screen">
      {/** Sidebar */}
      <div className="hidden md:flex">
        <Sidebar workspaceId={params.workspaceId} />
      </div>

      {/** Main Content */}
      <div className="flex flex-col w-full h-full md:pl-72 p-3 box-border">
        <div className="w-full">
          <NextTopLoader color="blue" speed={300} />
        </div>
        <div className="flex-grow">
          <Navbar />
        </div>
        <div>{params.workspaceId}</div>
        <div className="w-full h-full flex-grow items-start justify-start">
          {children}
        </div>
      </div>
    </div>
  );
}
