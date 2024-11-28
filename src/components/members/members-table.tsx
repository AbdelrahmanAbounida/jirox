import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WORKSPACE_MEMBER_ROLE } from "@/constants/enums";
import { Copy, Loader, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Member } from "@/types/members";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateMemberRole } from "@/services/members/update-member-role";
import { mutate } from "swr";
import { useCurrentUser } from "@/hooks/use-current-user";
import ConfirmDeleteModal from "../modals/confirm-delete-modal";
import { removeMember } from "@/services/members/delete-member";
import { useState } from "react";

export function MembersTable({ members }: { members: Member[] }) {
  const [updateLoading, setupdateLoading] = useState("");
  const currentUser = useCurrentUser();
  const handleupdateUserRole = async ({
    member,
    newRole,
  }: {
    member: Member;
    newRole: string;
  }) => {
    try {
      setupdateLoading(member.id);
      const resp = await updateMemberRole({
        memberId: member.id,
        newRole,
        workspaceId: member.workspaceId,
      });
      if (resp?.error || (resp?.statusCode && resp?.statusCode !== 200)) {
        toast.error(resp?.message);
      } else {
        if (!resp || !resp?.id) {
          toast.error("Something went wrong while updating member role");
          return;
        } else {
          toast.success("Member role updated successfully");
          mutate([member.workspaceId, "members"]);
        }
      }
    } catch (error) {
      console.log({ error });
      toast.error("Failed to update user role");
    } finally {
      setupdateLoading("");
    }
  };

  const handleDeleteMember = async ({ member }: { member: Member }) => {
    try {
      const resp = await removeMember({
        memberId: member.id,
      });
      if (resp?.error || (resp?.statusCode && resp?.statusCode !== 200)) {
        toast.error(resp?.message);
      } else {
        if (!resp) {
          toast.error("Something went wrong while deleting member ");
          return;
        } else {
          toast.success("Member  deleted successfully");
          mutate([member.workspaceId, "members"]);
        }
      }
    } catch (error) {
      console.log({ error });
      toast.error("Failed to delete member ");
    }
  };

  return (
    <Table className="p-9">
      {!members && <TableCaption>Your workspace Members</TableCaption>}
      <TableHeader className="mt-7 pt-7">
        <TableRow>
          <TableHead className="w-[160px]">Email</TableHead>
          <TableHead className="items-center justify-center text-center">
            Status
          </TableHead>
          <TableHead className="text-center ">Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members &&
          members.map((member) => (
            <TableRow
              key={member.id}
              className={cn(
                "  items-center justify-center text-center",
                currentUser?.email == member.email && "bg-slate-50"
              )}
            >
              <TableCell className="font-normal pr-9 text-start">
                {member.email}
              </TableCell>
              <TableCell
                className={cn(" flex items-center justify-center p-1 mt-2 ")}
              >
                <p
                  className={cn(
                    "w-[100px] p-1 rounded-md flex items-center text-center justify-center",
                    member.active
                      ? "bg-green-50 text-green-600   "
                      : "bg-red-50 text-red-500"
                  )}
                >
                  {member.active ? "Active" : "NotActive"}
                </p>
              </TableCell>
              <TableCell className="lowercase text-center  ">
                <Select
                  defaultValue={member.role}
                  value={member.role}
                  onValueChange={async (newValue) => {
                    await handleupdateUserRole({
                      newRole: newValue,
                      member: member,
                    });
                  }}
                >
                  <SelectTrigger
                    disabled={!!updateLoading}
                    className="w-[100px] mx-auto border-none shadow-none delay-100 transition-all  outline-none active:bg-gray-100 active:scale-95 bg-gray-50 hover:bg-gray-100/80"
                  >
                    {updateLoading == member.id ? (
                      <div className="flex w-full items-center justify-center">
                        <Loader className="animate-spin transition-all h-4 w-4 text-slate-500" />
                      </div>
                    ) : (
                      <SelectValue className="lowercase " placeholder="role" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="lowercase">
                        {member.role}
                      </SelectLabel>
                      {Object.entries(WORKSPACE_MEMBER_ROLE).map(
                        ([key, val], index) => (
                          <SelectItem
                            className="lowercase"
                            key={index}
                            value={key}
                          >
                            {val}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(member.id)}
                    >
                      <Copy className="" />
                      Copy Member ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <ConfirmDeleteModal
                      deleteButtonTitle="Remove Member"
                      onDelete={async () => {
                        await handleDeleteMember({ member });
                      }}
                      title="Remove Member"
                    >
                      <div className="flex items-center gap-2 text-sm pl-2 p-[6px] hover:bg-slate-100">
                        <Trash className="text-red-500 h-4 w-4" />
                        Remove Member
                      </div>
                    </ConfirmDeleteModal>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
