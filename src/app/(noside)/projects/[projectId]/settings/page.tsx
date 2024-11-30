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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import MainButton from "@/components/main-btn";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ConfirmDeleteModal from "@/components/modals/confirm-delete-modal";
import { updateProjectSchema } from "@/schemas/project-form-schema";
import { cn } from "@/lib/utils";
import { useProjectDetails } from "@/hooks/projects/use-project";
import { updateProject } from "@/services/projects/update-project";
import { deleteProject } from "@/services/projects/delete-project";
import { getEnumNameByColor, mapColorToEnum } from "@/utils/project-utils";
import { mutate } from "swr";
import { ProjectColor } from "@/constants/enums";

interface PageProps {
  params: {
    projectId: string;
  };
}

const ProjectSettings = ({ params }: PageProps) => {
  const router = useRouter();
  const [updateLoading, setupdateLoading] = useState(false);
  const [deleteLoading, setdeleteLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    data: project,
    isLoading,
    error,
  } = useProjectDetails({ projectId: params.projectId });

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project?.name!,
      color: mapColorToEnum(project?.color),
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

  const onSubmit = async (values: z.infer<typeof updateProjectSchema>) => {
    setupdateLoading(true);
    try {
      const resp = await updateProject({
        name: values.name,
        logo: uploadedLogo!,
        color: project.color!,
        projectId: project?.id!,
      });

      if (resp?.error || (resp?.statusCode && resp?.statusCode !== 200)) {
        toast.error(resp?.message);
      } else {
        if (!resp || !resp?.id) {
          toast.error("Something went wrong while updating new Project");
          return;
        }
        toast.success("Project updated Successfully");
        mutate(["projectDetails", project.id]);
      }
    } catch (error) {
      console.log({ error });
      toast.error("Failed to update Project");
    } finally {
      setupdateLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && project && !previewUrl) {
      setPreviewUrl(project?.logo);
      if (!form.getValues().name) {
        form.setValue("name", project?.name);
      }

      if (!form.getValues().color) {
        form.setValue("color", ProjectColor.Green);
      }
    }
  }, [isLoading, project, previewUrl]);

  const handleDeleteProject = async () => {
    try {
      setdeleteLoading(true);
      const resp = await deleteProject({ projectId: project?.id! });
      if (resp?.error || (resp?.statusCode && resp?.statusCode !== 200)) {
        toast.error(resp?.message);
      } else {
        if (!resp) {
          toast.error("Something went wrong while deleting new project");
          return;
        }
        toast.success("project deleted Successfully");
        router.push(`/workspaces/${project?.workspaceId}/home`);
      }
    } catch (error) {
      console.log({ error });
      toast.error("Failed to delete project");
    } finally {
      setdeleteLoading(false);
    }
  };

  return (
    <div className="w-full h-full gap-7 flex flex-col bg-gray-100  items-center justify-start rounded-md">
      {!isLoading || project ? (
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

                <p className="text-md font-bold"> {project?.name}</p>
              </div>
              <Separator className="my-3" />

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5 mt-7"
                >
                  {/* Project Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Project" {...field} />
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
                          defaultValue={
                            field.value || mapColorToEnum(project?.color)
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {Object.entries(ProjectColor).map(
                              ([key, val], index) => (
                                <SelectItem key={index} value={val.toString()}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      style={{ backgroundColor: val }}
                                      className={cn("rounded-full w-3 h-3")}
                                    />
                                    {key}
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

                  {/* Project Icon */}
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
                      <p className="text-sm">Project Icon</p>
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
                      <MainButton type="submit">Update Project</MainButton>
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
            Deleting a Project is irreversible and will remove all associated
            data.
          </p>
        </div>
        <div className="flex w-full justify-end mt-7">
          {/** TODO:: this is confirm modal */}
          <ConfirmDeleteModal
            deleteButtonTitle="Delete Project"
            onDelete={handleDeleteProject}
          >
            {deleteLoading ? (
              <MainButton className="bg-red-500" disabled>
                <Loader className="animate-spin w-4 h-4" /> Loading
              </MainButton>
            ) : (
              <Button variant={"destructive"} className="h-8">
                Delete Project
              </Button>
            )}
          </ConfirmDeleteModal>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;

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
