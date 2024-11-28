"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useWorkspaces } from "@/hooks/workspaces/useWorkspaces";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Workspace } from "@/types/workspace";

function WorkspacesSwitcher({ workspaceId }: { workspaceId?: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(workspaceId);

  const { data: allWorkspaces, isLoading } = useWorkspaces();

  React.useEffect(() => {
    if (!isLoading && !allWorkspaces?.length) {
      toast.success("You have to create workspace first");
      return redirect("/workspaces/create");
    }
  }, [isLoading, allWorkspaces]);

  const ws = allWorkspaces?.find((workspace) => workspace.id === value);

  if (isLoading) {
    return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={isLoading} asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-200 hover:bg-gray-200/80 py-5 px-1"
        >
          {value ? (
            ws ? (
              <WorkspaceTitle value={value} workspace={ws} />
            ) : (
              "Select workspace"
            )
          ) : (
            "Select workspace"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput className="w-full" placeholder="Search workspace..." />
          <CommandList>
            <CommandEmpty>No workspaces found.</CommandEmpty>
            <CommandGroup
              defaultValue={ws?.id}
              defaultChecked
              className="w-full "
            >
              {allWorkspaces?.map((workspace) => (
                <CommandItem
                  className="w-full items-center justify-start flex"
                  key={workspace.id}
                  value={workspace.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                    router.push(`/workspaces/${workspace?.id}/home`);
                  }}
                >
                  <WorkspaceTitle value={value} workspace={workspace} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default WorkspacesSwitcher;

const WorkspaceTitle = ({
  value,
  workspace,
}: {
  value?: string;
  workspace: Workspace;
}) => (
  <div
    className={cn(
      "flex items-center gap-3  w-full justify-start hover:opacity-100 transition-all delay-75 cursor-pointer",
      value === workspace.id ? "opacity-100" : "opacity-75"
    )}
  >
    <div className="flex   items-center">
      <img src={workspace.logo} alt="ws logo" className="rounded-md w-9 h-9" />
    </div>
    <p className="text-md font-medium"> {workspace.name}</p>
  </div>
);
