"use client";
import MainButton from "@/components/main-btn";
import NewMemberModal from "@/components/modals/new-member-modal";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceMembers } from "@/hooks/members/use-workspace-members";
import {
  ChevronLeft,
  Ellipsis,
  EllipsisVertical,
  Plus,
  PlusCircle,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { MembersTable } from "@/components/members/members-table";

interface PageProps {
  params: {
    workspaceId: string;
  };
}

const Members = ({ params }: PageProps) => {
  const router = useRouter();
  // TODO:: Load members and handle crud operations over them
  const { data: members, isLoading } = useWorkspaceMembers({
    workspaceId: params.workspaceId,
  });

  return (
    <div className="w-full h-full bg-gray-100 flex items-start  justify-center rounded-md">
      <div className="mt-10 w-full items-center justify-center flex">
        <div className="w-full max-w-3xl bg-white rounded-md shadow-md p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center  gap-3 w-full">
              <Button
                onClick={() => {
                  router.back();
                }}
                variant={"outline"}
                className="h-7 flex items-center  gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <p className="text-sm">Back</p>
              </Button>

              <p className="text-md font-medium"> Acme Corp</p>
            </div>

            <NewMemberModal workspaceId={params.workspaceId}>
              <MainButton className="h-7">
                <div className="text-xs flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Member
                </div>
              </MainButton>
            </NewMemberModal>
          </div>
          {/* <Separator className="my-3" /> */}

          <div className="flex items-start gap-3 flex-col mt-7">
            {isLoading ? (
              <MembersSkeleton />
            ) : (
              !isLoading && <MembersTable members={members!} />
            )}

            {members?.length == 0 && (
              <div className="flex items-center  p-9 text-center justify-center w-full  rounded-md text-sm text-gray-500">
                <Users className="mr-2 w-4 h-4" />
                <p>No Members found in this workspace</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;

const MembersSkeleton = () => {
  return [1, 2].map((member, index) => (
    <>
      <div className="flex items-center w-full my-3 justify-between">
        {/** Assignee Person */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />

          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-full rounded-full" />
            <Skeleton className="h-9 w-full rounded-full" />
          </div>
        </div>

        <Skeleton className="h-3 w-3 rounded-full" />
      </div>
      {index < 1 && <Separator />}
    </>
  ));
};
