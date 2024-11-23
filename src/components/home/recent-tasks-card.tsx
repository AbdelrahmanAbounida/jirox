import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Calendar, PlusIcon } from "lucide-react";
import { Separator } from "../ui/separator";

const RecentTasksCard = () => {
  return (
    <Card className="h-[390px] bg-gray-50">
      <CardHeader>
        <CardTitle className="flex items-center w-full gap-2 justify-between">
          <p>Recent Assigned Tasks (12)</p>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="shadow-sm w-8 h-8 border rounded-md"
          >
            <PlusIcon className="" />
          </Button>
        </CardTitle>
        <Separator className="mb-2" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-6">
        <TaskCard
          title="Conduct usability Testing"
          tag="Mobile App Development"
          dueDays={14}
        />
        <TaskCard
          title="Implement Offline Mode"
          tag="Mobile App Development"
          dueDays={14}
        />
        <TaskCard
          title="Integrate Push Notifications"
          tag="Mobile App Development"
          dueDays={14}
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full ">Show All</Button>
      </CardFooter>
    </Card>
  );
};

export default RecentTasksCard;

const TaskCard = ({
  title,
  tag,
  dueDays,
}: {
  title: string;
  tag: string;
  dueDays: number;
}) => (
  <div className="bg-white w-full rounded-xl p-3 cursor-pointer">
    <p className="text-md">{title}</p>
    <div className="flex items-center  gap-7">
      <p className=" text-gray-500 text-sm">{tag}</p>
      <p className="text-gray-500 flex items-center text-xs">
        <Calendar className="mr-1 text-gray-500 text-xs" size={11} />
        {dueDays} days
      </p>
    </div>
  </div>
);
