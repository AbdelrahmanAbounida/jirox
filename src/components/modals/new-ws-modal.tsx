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
import React, { useRef, useState } from "react";
import MainButton from "../main-btn";
import { Image, Loader, PlusIcon } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createWorkspace } from "@/services/workspaces/create-workspace";

const NewWorkspaceModal = ({
  children,
  workspaceId,
}: {
  workspaceId?: string;
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [createLoading, setcreateLoading] = useState(false);

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {},
  });
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadLogo = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    if (file) {
      setUploadedLogo(file);
      setPreviewUrl(URL.createObjectURL(file));
      console.log("File uploaded successfully:", file.name);
    } else {
      console.warn("No file selected.");
    }
  };

  const onSubmit = async (values: z.infer<typeof createWorkspaceSchema>) => {
    if (!uploadedLogo) {
      toast.error("Upload a workspace logo first");
      return;
    }

    setcreateLoading(true);
    try {
      const resp = await createWorkspace({
        name: values.name,
        logo: uploadedLogo,
      });

      console.log({ resp });

      if (resp?.error || (resp?.statusCode && resp?.statusCode !== 200)) {
        toast.error(resp?.message);
      } else {
        if (!resp || !resp?.id) {
          toast.error("Something went wrong while creating new workspace");
          return;
        }
        toast.success("Workspace Created Successfully");
        router.push(`/workspaces/${resp?.id}/home`);
      }
    } catch (error) {
      console.log({ error });
      toast.error("Failed to create workspace");
    } finally {
      setcreateLoading(false);
    }
  };

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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mt-7"
          >
            {/* Workspace Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Workspace" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Workspace Icon */}
            <div className="flex items-start gap-3 my-3">
              <Avatar className="bg-gray-100 flex items-center justify-center rounded-full p-2 w-20 h-20">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="rounded-full w-full h-full object-cover"
                  />
                ) : (
                  <Image className="h-9 w-9 text-gray-400" />
                )}
              </Avatar>

              <div className="flex flex-col items-start gap-1 flex-1 w-full">
                <p className="text-sm">Workspace Icon</p>
                <p className="text-gray-400 text-sm">
                  400px, JPG or PNG, max 2000kb
                </p>
                <Button
                  type="button"
                  onClick={handleButtonClick}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-500 font-medium h-7 mt-2"
                >
                  Upload Image
                </Button>
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleUploadLogo}
                  className="hidden"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex w-full items-center justify-end pt-5">
              {createLoading ? (
                <MainButton className="" disabled>
                  <Loader className="animate-spin w-4 h-4" /> Loading
                </MainButton>
              ) : (
                <MainButton type="submit">Create Workspace</MainButton>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewWorkspaceModal;
