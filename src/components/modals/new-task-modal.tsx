"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import MainButton from "../main-btn";
import { Loader, PlusIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createTaskSchema } from "@/schemas/task-form-schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProjectTitle from "../tasks/project-title";
import { useWorkspaceProjects } from "@/hooks/projects/use-projects";
import { Project } from "@/types/project";
import { useWorkspaceMembers } from "@/hooks/members/use-workspace-members";
import { toast } from "sonner";
import { createTask } from "@/services/tasks/create-task";
import { mutate } from "swr";
import { TaskEnum } from "@/constants/enums";

const NewTaskmodal = ({
  children,
  workspaceId,
}: {
  workspaceId: string;
  children?: React.ReactNode;
}) => {
  const [createLoading, setcreateLoading] = useState(false);
  const [open, setopen] = useState(false);

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {},
  });
  async function onSubmit(values: z.infer<typeof createTaskSchema>) {
    setcreateLoading(true);

    try {
      const resp = await createTask(values);
      if (resp?.error || (resp?.statusCode && resp?.statusCode !== 200)) {
        toast.error(resp?.message);
      } else {
        if (!resp || !resp?.id) {
          toast.error("Something went wrong while creating new Task");
          return;
        }
        toast.success("Task Created Successfully");
        setopen(false);
        form.reset();
        mutate(["projectTasks", resp?.projectId]);
      }
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong! Failed to create task");
    } finally {
      setcreateLoading(false);
    }
  }

  const { data: AllProjects, isLoading: LoadingProjects } =
    useWorkspaceProjects({ workspaceId: workspaceId! });
  const { data: workspaceMembers, isLoading: LoadingMembers } =
    useWorkspaceMembers({ workspaceId: workspaceId });

  useEffect(() => {
    // update form defaults
    if (!LoadingMembers && workspaceMembers && !form.getValues("assigneeId")) {
      form.setValue("assigneeId", workspaceMembers?.find((e) => !e)?.id!);
    }
    if (!LoadingProjects && AllProjects && !form.getValues("projectId")) {
      form.setValue("projectId", AllProjects?.find((e) => !e)?.id!);
    }
  }, [LoadingMembers, LoadingProjects, AllProjects, workspaceMembers]);

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogTrigger>
        {children ?? (
          <MainButton>
            <PlusIcon className="text-white" />
            New
          </MainButton>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Create New Task</DialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/** 1- task Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Do homework" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** 2- Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full ">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            " pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full max-w-md md:max-w-lg lg:max-w-xl p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        // selected={field.value}
                        // onSelect={field.onChange}
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => field.onChange(date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Assignee */}
            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <Select
                    disabled={LoadingMembers}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger disabled={LoadingMembers}>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workspaceMembers?.map((member, index) => (
                        <SelectItem key={index} value={member.id}>
                          {member.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** 4- Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    disabled={LoadingMembers}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger disabled={LoadingProjects}>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {Object.entries(TaskEnum)
                        // .filter((val) => parseInt(val.toString()))
                        .map(([key, val], index) => (
                          <SelectItem key={index} value={key.toString()}>
                            {val}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** 5- Project */}
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={
                      field.value || AllProjects?.find((e) => !e)?.id
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      defaultValue={AllProjects?.find((e) => !e)?.id}
                    >
                      {AllProjects?.map((project, index) => (
                        <SelectItem key={index} value={project.id}>
                          <ProjectTitle title={project?.name!} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <Button type="submit">Create Task</Button> */}
            <div className="flex w-full items-center justify-between">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              {createLoading ? (
                <MainButton disabled type="submit">
                  <Loader className="animate-spin h-4 w-4 transition-all" />{" "}
                  Loading
                </MainButton>
              ) : (
                <MainButton type="submit"> Create Task</MainButton>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskmodal;
