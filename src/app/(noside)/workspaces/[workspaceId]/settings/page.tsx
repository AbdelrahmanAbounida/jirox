"use client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, Image, Loader } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { useCurrentWorkspace } from "@/hooks/workspaces/use-current-workspace";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { updateWorkspace } from "@/services/workspaces/update-workspace";
import ConfirmDeleteModal from "@/components/modals/confirm-delete-modal";
import { deleteWorkspace } from "@/services/workspaces/delete-wokspace";

interface PageProps {
  params: {
    workspaceId: string;
  };
}

const Settings = ({ params }: PageProps) => {
  const router = useRouter();
  const [updateLoading, setupdateLoading] = useState(false);
  const [deleteLoading, setdeleteLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    data: workspace,
    isLoading,
    error,
  } = useCurrentWorkspace(params.workspaceId);

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: workspace?.name!,
    },
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
    } else {
      console.warn("No file selected.");
    }
  };

  const onSubmit = async (values: z.infer<typeof createWorkspaceSchema>) => {
    setupdateLoading(true);
    try {
      const resp = await updateWorkspace({
        name: values.name,
        logo: uploadedLogo!,
        workspaceId: workspace?.id!,
      });

      if (resp?.error || (resp?.statusCode && resp?.statusCode !== 200)) {
        toast.error(resp?.message);
      } else {
        if (!resp || !resp?.id) {
          toast.error("Something went wrong while updating new workspace");
          return;
        }
        toast.success("Workspace updated Successfully");
        // router.push(`/workspaces/${resp?.id}/home`);
      }
    } catch (error) {
      console.log({ error });
      toast.error("Failed to update workspace");
    } finally {
      setupdateLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && workspace && !previewUrl) {
      setPreviewUrl(workspace?.logo);
      if (!form.getValues().name) {
        form.setValue("name", workspace?.name);
      }
    }
  }, [isLoading, workspace, previewUrl]);

  const handleDeleteWorkspace = async () => {
    try {
      setdeleteLoading(true);
      const resp = await deleteWorkspace({ workspaceId: workspace?.id! });
      if (resp?.error || (resp?.statusCode && resp?.statusCode !== 200)) {
        toast.error(resp?.message);
      } else {
        if (!resp) {
          toast.error("Something went wrong while deleting new workspace");
          return;
        }
        toast.success("Workspace deleted Successfully");
        router.push(`/workspaces`);
      }
    } catch (error) {
      console.log({ error });
      toast.error("Failed to delete workspace");
    } finally {
      setdeleteLoading(false);
    }
  };

  // if (isLoading) {
  //   return <SettingsSkeleton />;
  // }

  return (
    <div className="w-full h-full gap-7 flex flex-col bg-gray-100  items-center justify-start rounded-md">
      {!isLoading || workspace ? (
        <>
          <div className="mt-10 ">
            <div className="w-auto min-w-[550px] bg-white rounded-md shadow-md p-7">
              <div className="flex items-center  gap-3 w-full">
                <Button
                  onClick={() => {
                    router.back();
                  }}
                  variant={"outline"}
                  className="h-7 flex items-center  gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <p className="text-sm">Back</p>
                </Button>

                <p className="text-md font-medium"> Test Workspace</p>
              </div>
              <Separator className="my-3" />

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
                    {updateLoading ? (
                      <MainButton className="" disabled>
                        <Loader className="animate-spin w-4 h-4" /> Loading
                      </MainButton>
                    ) : (
                      <MainButton type="submit">Update Workspace</MainButton>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </>
      ) : (
        <SettingsSkeleton />
      )}

      <div className="w-auto min-w-[550px] bg-white rounded-md shadow-md p-7 ">
        <div className="flex flex-col w-full">
          <p className="font-medium text-md">Danger Zone</p>
          <p className="text-gray-500 text-sm">
            Deleting a workspace is irreversible and will remove all associated
            data.
          </p>
        </div>
        <div className="flex w-full justify-end mt-7">
          {/** TODO:: this is confirm modal */}
          <ConfirmDeleteModal
            deleteButtonTitle="Delete Workspace"
            onDelete={handleDeleteWorkspace}
          >
            {deleteLoading ? (
              <MainButton className="bg-red-500" disabled>
                <Loader className="animate-spin w-4 h-4" /> Loading
              </MainButton>
            ) : (
              <Button variant={"destructive"} className="h-8">
                Delete Workspace
              </Button>
            )}
          </ConfirmDeleteModal>
        </div>
      </div>
    </div>
  );
};

export default Settings;

const SettingsSkeleton = () => (
  <div className="w-full h-full gap-7 flex flex-col   items-center justify-start rounded-md">
    <div className="mt-10 ">
      <div className="w-auto min-w-[550px]  rounded-md shadow-md p-7">
        <div className="flex items-center  gap-3 w-full">
          <Skeleton className="w-[50px] h-5" />
          <Skeleton className="w-[90px] h-5" />
        </div>
        <Separator className="my-8" />

        <div className="flex flex-col gap-3 mb-4">
          <Skeleton className="w-[70%] h-5" />
          <Skeleton className="w-full h-9" />
        </div>

        <div className="w-full flex items-center gap-2 mt-4">
          <Skeleton className="rounded-full h-20 w-20" />

          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="w-[60%] h-3" />
            <Skeleton className="w-[40%] h-3" />
            <Skeleton className="w-20 h-7 " />
          </div>
        </div>

        <div className="w-full flex justify-end">
          <Skeleton className="w-24 h-7" />
        </div>
      </div>
    </div>

    <div className="w-auto min-w-[550px] bg-white rounded-md shadow-md p-7 ">
      <div className="flex flex-col w-full gap-2">
        <Skeleton className="w-[10%] h-3 " />
        <Skeleton className="w-[90%] h-3 " />
      </div>
      <div className="flex w-full justify-end mt-7">
        <Skeleton className="w-24 h-7 " />
      </div>
    </div>
  </div>
);
