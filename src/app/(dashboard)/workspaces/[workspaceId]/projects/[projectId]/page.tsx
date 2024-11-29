"use client";
import InfoCard from "@/components/home/info-card";
import MyTasks from "@/components/my-tasks";
import ProjectTitle from "@/components/tasks/project-title";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectDetails } from "@/hooks/projects/use-project";
import { useProjectTasks } from "@/hooks/tasks/use-project-tasks";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface ProjectPageParams {
  params: {
    projectId: string;
  };
}

const ProjectPage = ({ params }: ProjectPageParams) => {
  const router = useRouter();

  const { data: currentProject, isLoading } = useProjectDetails({
    projectId: params.projectId,
  });

  const { data: projectTasks, isLoading: LoadingTasks } = useProjectTasks({
    projectId: params.projectId,
  });

  return (
    <div className="h-full">
      {/** TODO:: Show Project Details like tasks list , members  */}

      {/** title, edit project */}
      <div className="flex items-center justify-between w-full p-3 mb-5">
        {isLoading ? (
          <Skeleton className="w-[100px] h-7" />
        ) : (
          <ProjectTitle title={currentProject?.name!} />
        )}
        <Link
          href={`/projects/${params.projectId}/settings`}
          className="h-8 text-sm flex items-center gap-2 rounded-md border  p-2 hover:bg-gray-50 shadow-sm transition-all delay-75"
        >
          <Pencil className="h-4 w-4" />
          Edit Project
        </Link>
      </div>

      {/** TODO:: start here  */}
      <div className="flex flex-wrap items-center gap-3 my-3">
        <InfoCard title="Total Tasks" value={6} incrementValue={6} />
        <InfoCard title="Total Tasks" value={6} incrementValue={6} />
        <InfoCard title="Total Tasks" value={6} incrementValue={6} />
        <InfoCard title="Total Tasks" value={6} incrementValue={6} />
      </div>

      {/** list of task views */}
      <div className="h-full pb-4">
        <MyTasks projectId={params?.projectId} />
      </div>
    </div>
  );
};

export default ProjectPage;
