"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import MainButton from "../main-btn";
import { PlusIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { TASK_STATUS } from "@/schemas/enums";

const NewTaskmodal = ({
  children,
  projectId,
}: {
  projectId?: string;
  children?: React.ReactNode;
}) => {
  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {},
  });
  function onSubmit(values: z.infer<typeof createTaskSchema>) {
    console.log(values);
  }

  return (
    <Dialog>
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
                        selected={field.value}
                        onSelect={field.onChange}
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="m@example.com">
                        m@example.com
                      </SelectItem>
                      <SelectItem value="m@google.com">m@google.com</SelectItem>
                      <SelectItem value="m@support.com">
                        m@support.com
                      </SelectItem>
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {Object.entries(TASK_STATUS)
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Test project">
                        <ProjectTitle title="Test project" />
                      </SelectItem>
                      <SelectItem value="Test project2">
                        <ProjectTitle title="Test project2" />
                      </SelectItem>
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
              <MainButton type="submit"> Create Task</MainButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskmodal;
