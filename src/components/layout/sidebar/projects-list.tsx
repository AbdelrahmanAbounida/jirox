import ProjectTitle from "@/components/tasks/project-title";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceProjects } from "@/hooks/projects/use-projects";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const ProjectsList = ({ workspaceId }: { workspaceId: string }) => {
  const currentPath = usePathname();

  const {
    data: projectsList,
    isLoading,
    error,
  } = useWorkspaceProjects({
    workspaceId,
  });

  if (isLoading) {
    return <ProjectsSkeleton />;
  }
  console.log({ projectsList });

  if (!isLoading && error) {
    toast.error(error + "");
    return;
  }

  return (
    <div>
      <div className=" flex flex-col gap-1 items-start  justify-start mt-2 ">
        {!error &&
          projectsList?.map((project, index) => (
            <Link
              href={`/workspaces/${workspaceId}` + "/projects/" + project.id}
              className="my-1 cursor-pointer w-full  items-start hover:bg-gray-50"
            >
              <ProjectTitle
                title={project.name}
                className={cn(
                  "text-gray-600  p-2 rounded-md  items-center justify-start  text-wrap truncate ...",
                  currentPath.includes(project.id) && "bg-white"
                )}
                key={index}
              />
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ProjectsList;

const ProjectsSkeleton = () => (
  <div className=" flex flex-col gap-1 items-start mt-2 ">
    {[1, 2].map((item, index) => (
      <Skeleton className="w-full h-8" key={index} />
    ))}
  </div>
);
