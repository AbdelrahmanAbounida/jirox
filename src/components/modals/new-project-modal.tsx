"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import MainButton from "../main-btn";
import { Image, PlusIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProjectSchema } from "@/schemas/project-form-schema";
import { ProjectColor } from "@/schemas/enums";
import { Avatar } from "../ui/avatar";

const NewProjectModal = ({
  children,
  projectId,
}: {
  projectId?: string;
  children?: React.ReactNode;
}) => {
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {},
  });
  function onSubmit(values: z.infer<typeof createProjectSchema>) {
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
        <DialogTitle>Create New Project</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/** 1- Project Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Do homework" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** 2- color */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
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
                      {Object.entries(ProjectColor).map(([key, val], index) => (
                        <SelectItem key={index} value={val.toString()}>
                          <div className="flex items-center gap-2">
                            <div
                              style={{ backgroundColor: val }}
                              className={cn("rounded-full w-3 h-3")}
                            />
                            {key}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** project Icon */}
            <div className="flex items-start gap-3 my-3 ">
              <Avatar className="bg-gray-100 flex items-center justify-center rounded-full p-2 w-20 h-20">
                <Image className="h-9 w-9 text-gray-400" />
              </Avatar>

              <div className="flex flex-col items-start gap-1 flex-1 w-full ">
                <p className="text-sm">Project Icon</p>
                <p className="text-gray-400 text-sm">
                  400px, JPG or PNG, max 2000kb
                </p>
                <Button className="bg-blue-100 hover:bg-blue-200 text-blue-500 font-medium h-7 mt-2">
                  Upload Image
                </Button>
              </div>
            </div>

            <div className="flex w-full items-center justify-between pt-5">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <MainButton type="submit"> Create Project</MainButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
