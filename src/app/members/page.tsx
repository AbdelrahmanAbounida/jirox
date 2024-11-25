import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Ellipsis, EllipsisVertical } from "lucide-react";
import React from "react";

const Members = () => {
  return (
    <div className="w-full h-full bg-gray-100 flex items-start justify-center rounded-md">
      <div className="mt-10 ">
        <div className="w-auto min-w-[550px] bg-white rounded-md shadow-md p-5">
          <div className="flex items-center  gap-3 w-full">
            <Button
              variant={"outline"}
              className="h-7 flex items-center  gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <p className="text-sm">Back</p>
            </Button>

            <p className="text-md font-medium"> Acme Corp</p>
          </div>
          {/* <Separator className="my-3" /> */}

          <div className="flex items-start gap-3 flex-col mt-4">
            {[1, 2].map((member, index) => (
              <>
                <div className="flex items-center w-full my-3 justify-between">
                  {/** Assignee Person */}
                  <div className="flex items-center gap-2">
                    <Avatar className="bg-gray-300 flex items-center justify-center font-medium text-sm">
                      A
                    </Avatar>

                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">Anotonio</p>
                      <p className="text-sm text-gray-500">antonio@gmail.com</p>
                    </div>
                  </div>

                  {/** TODO:: DropDown */}

                  <Button variant={"outline"} className="w-7" size={"icon"}>
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </div>
                {index < 1 && <Separator />}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
