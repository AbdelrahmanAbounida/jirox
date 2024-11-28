"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
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
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { addMemberSchema } from "@/schemas/members-schema";
import { inviteNewMember } from "@/services/members/invite-member";
import { WORKSPACE_MEMBER_ROLE } from "@/constants/enums";

const NewMemberModal = ({
  children,
  workspaceId,
}: {
  workspaceId?: string;
  children?: React.ReactNode;
}) => {
  const [createLoading, setcreateLoading] = useState(false);
  const [open, setopen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {},
  });
  async function onSubmit(values: z.infer<typeof addMemberSchema>) {
    setcreateLoading(true);
    try {
      const resp = await inviteNewMember({
        email: values.email,
        role: values.role,
        workspaceId: workspaceId!,
      });

      if (resp?.error || (resp?.statusCode && resp?.statusCode !== 200)) {
        toast.error(resp?.message);
      } else {
        if (!resp || !resp?.id) {
          toast.error("Something went wrong while inviting new member");
          return;
        }
        toast.success("Invitation sent Successfully");
        // close the model
        setopen(false);
        mutate([workspaceId, "members"]);
      }
    } catch (error) {
      console.log({ error });
      toast.error("Failed to invite member");
    } finally {
      setcreateLoading(false);
    }
  }

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
        <DialogTitle>Add New Member</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="asd@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** 2- color */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
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
                      {Object.entries(WORKSPACE_MEMBER_ROLE).map(
                        ([key, val], index) => (
                          <SelectItem key={index} value={val.toString()}>
                            <div className="flex items-center gap-2 lowercase ">
                              {val}
                            </div>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full items-center justify-between pt-5">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>

              {createLoading ? (
                <MainButton className="" disabled>
                  <Loader className="animate-spin w-4 h-4" /> Loading
                </MainButton>
              ) : (
                <MainButton type="submit">Invite Member</MainButton>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewMemberModal;
