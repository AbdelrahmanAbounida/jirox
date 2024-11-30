"use client";
import InfoCard, { InfoCardSkeleton } from "@/components/home/info-card";
import MyTasks from "@/components/my-tasks";
import ProjectTitle from "@/components/tasks/project-title";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectDetails } from "@/hooks/projects/use-project";
import { useProjectTasks } from "@/hooks/tasks/use-project-tasks";
import {
  getTaskAnalytics,
  TaskAnalyticsProps,
} from "@/services/analytics/tasks-analytics";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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

  const [taskAnalytics, setTaskAnalytics] = useState<TaskAnalyticsProps>();

  useEffect(() => {
    if (!isLoading && !currentProject) {
      router.push("/workspaces");
    }
  }, [isLoading, currentProject]);

  useEffect(() => {
    if (!LoadingTasks) {
      setTaskAnalytics(getTaskAnalytics(projectTasks!));
    }
  }, [LoadingTasks, projectTasks]);

  return (
    <div className="h-full">
      {/** title, edit project */}
      <div className="flex items-center justify-between w-full p-3  ">
        {isLoading ? (
          <Skeleton className="w-[100px] h-7" />
        ) : (
          <ProjectTitle className="text-lg" title={currentProject?.name!} />
        )}
        <Link
          href={`/projects/${params.projectId}/settings`}
          className="h-8 text-sm flex items-center gap-2 rounded-md border  p-2 hover:bg-gray-50 shadow-sm transition-all delay-75"
        >
          <Pencil className="h-4 w-4" />
          Edit Project
        </Link>
      </div>

      {LoadingTasks ? (
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {[1, 2, 3, 4].map((_, index) => (
            <InfoCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <InfoCard
            title="Total Tasks"
            incrementValue={taskAnalytics?.totalYesterday!}
            value={taskAnalytics?.total!}
          />
          <InfoCard
            title="Assigned Tasks"
            incrementValue={taskAnalytics?.assigned!}
            value={taskAnalytics?.assigned!}
          />
          <InfoCard
            title="Completed Tasks"
            incrementValue={taskAnalytics?.completed!}
            value={taskAnalytics?.completed!}
          />
          <InfoCard
            title="OverDue Tasks"
            incrementValue={taskAnalytics?.overdue!}
            value={taskAnalytics?.overdue!}
          />
        </div>
      )}

      {/** list of task views */}
      <div className="h-full pb-4">
        <MyTasks
          projectId={params?.projectId}
          workspaceId={currentProject?.workspaceId!}
        />
      </div>
    </div>
  );
};

export default ProjectPage;
