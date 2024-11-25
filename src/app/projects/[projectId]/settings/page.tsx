"use client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Image } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const ProjectSettings = () => {
  const router = useRouter();

  return (
    <div className="w-full h-full bg-gray-100">
      <div className="mx-auto  max-w-xl pt-9  flex flex-col gap-5 ">
        {/** Card 1 */}
        <Card className="rounded-md bg-white w-full   p-5 flex flex-col items-center shadow-sm">
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

            <p className="text-lg font-bold"> Acme Corp</p>
          </div>
          <Separator className="my-3" />

          <div className="flex flex-col mt-2 gap-1  w-full">
            <p className="text-sm font-medium pl-1">Project Name</p>
            <Input
              value={"Mobile App Development"}
              placeholder="Update Project Title"
            />

            <div className="flex items-start gap-3 mt-3">
              <Avatar className="bg-gray-100 flex items-center justify-center rounded-md p-2 w-20 h-20">
                <Image className="h-9 w-9 text-gray-400" />
              </Avatar>

              <div className="flex flex-col items-start gap-1 flex-1 w-full ">
                <p className="text-sm">Project Image</p>
                <p className="text-gray-400 text-sm">
                  400px, JPG or PNG, max 2000kb
                </p>
                <Button className="bg-blue-100 hover:bg-blue-200 text-blue-500 font-medium h-7 mt-2">
                  Upload Image
                </Button>
              </div>
            </div>

            <div className="w-full flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white h-7">
                Save Changes
              </Button>
            </div>
          </div>
        </Card>

        {/** Card2 */}

        <Card className="p-5">
          <div className="flex flex-col">
            <p className="font-medium text-md">Danger Zone</p>
            <p className="text-gray-400 text-sm">
              Deleting a project is irreversible and will remove all associated
              data.
            </p>
          </div>
          <div className="text-end">
            <Button variant={"destructive"} className="h-7 mt-5 ">
              Delete Project
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectSettings;
