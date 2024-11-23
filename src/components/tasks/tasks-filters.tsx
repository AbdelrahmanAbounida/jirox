"use client";

import {
  Calendar,
  Check,
  ChevronsUpDown,
  Kanban,
  List,
  User,
} from "lucide-react";
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
import React from "react";
import { ListCheck } from "lucide-react";

const TasksFilters = () => {
  {
    /** todo:: Handle Filtering Functionality */
  }
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <TaskFilter filterTitle="All Statuses" icon={<ListCheck />} />
      <TaskFilter filterTitle="All Assignees" icon={<User />} />
      <TaskFilter filterTitle="All Projects" icon={<Kanban />} />
      <Button
        className="h-8  transition-all delay-100 active:scale-95"
        variant={"outline"}
      >
        <Calendar />
        Due date
      </Button>
    </div>
  );
};

export default TasksFilters;

const TaskFilter = ({
  filterTitle,
  icon,
}: {
  filterTitle: string;
  icon: React.ReactNode;
}) => {
  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-8 w-[165px] justify-between transition-all delay-100 active:scale-95"
        >
          <div className="flex items-center font-normal text-[13px]">
            <div className="mr-3">{icon}</div>
            <p className="">{filterTitle}</p>
          </div>
          {/* {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."} */}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[165px]  p-0">
        <Command className="">
          <CommandInput className="" placeholder="Search framework..." />
          <CommandList className="">
            <CommandEmpty className="">No framework found.</CommandEmpty>
            <CommandGroup className="">
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
