"use client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { Image } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MainButton from "@/components/main-btn";
import { createWorkspaceSchema } from "@/schemas/ws-form-schema";

const CreateFirstWorkspacePage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {},
  });
  function onSubmit(values: z.infer<typeof createWorkspaceSchema>) {
    console.log(values);
  }

  return (
    <div className="w-full h-full bg-gray-100 flex items-start justify-center rounded-md">
      <div className="mt-10 ">
        <div className="w-auto min-w-[550px] bg-white rounded-md shadow-md p-5">
          <div className="flex items-center  gap-3 w-full">
            <p className="text-md font-medium">
              Create Your first Workspace 👌
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 mt-7"
            >
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

              <div className="flex w-full items-center justify-end pt-5 ">
                {/* <Button  type="button" variant="secondary">
                  Cancel
                </Button> */}
                <MainButton type="submit"> Create Workspace</MainButton>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateFirstWorkspacePage;
