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
import { Avatar } from "../ui/avatar";
import { createWorkspaceSchema } from "@/schemas/ws-form-schema";

const NewWorkspaceModal = ({
  children,
  workspaceId,
}: {
  workspaceId?: string;
  children?: React.ReactNode;
}) => {
  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {},
  });
  function onSubmit(values: z.infer<typeof createWorkspaceSchema>) {
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
        <DialogTitle>Create New Workspace</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/** 1- Workspace Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Do homework" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Workspace Icon */}
            <div className="flex items-start gap-3 my-3 ">
              <Avatar className="bg-gray-100 flex items-center justify-center rounded-full p-2 w-20 h-20">
                <Image className="h-9 w-9 text-gray-400" />
              </Avatar>

              <div className="flex flex-col items-start gap-1 flex-1 w-full ">
                <p className="text-sm">Workspace Icon</p>
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
              <MainButton type="submit"> Create Workspace</MainButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewWorkspaceModal;
