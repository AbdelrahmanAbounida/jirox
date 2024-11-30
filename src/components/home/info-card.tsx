import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconType } from "react-icons/lib";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";
import { DashIcon } from "@radix-ui/react-icons";

export interface InfoCardProps {
  title: string;
  value: number;
  incrementValue: number; // positive or negative
  icon?: ReactNode; //IconType | typeof Icon;
}

const InfoCard = ({
  title,
  value,
  icon: Icon,
  incrementValue,
}: InfoCardProps) => {
  return (
    <div className="w-full flex flex-1 min-w-[250px] ">
      <Card className="w-full">
        <CardHeader className="justify-between flex flex-row p-0">
          <div className="flex flex-col gap-2 ">
            <CardTitle className="text-gray-600 pl-5 font-bold pt-3 capitalize mt-3">
              {title}
            </CardTitle>
            <CardDescription className="font-medium text-xl pl-5 text-black ">
              {value}
            </CardDescription>
          </div>
          {Icon}
        </CardHeader>
        <CardContent className="pt-3 pl-4 font-medium">
          <p className="flex items-center  font-medium">
            <span
              className={cn(
                incrementValue > 0
                  ? "text-green-500"
                  : incrementValue == 0
                  ? "text-gray-500"
                  : "text-red-500",
                "flex items-center mr-1"
              )}
            >
              {incrementValue > 0 ? (
                <ChevronUp className="" />
              ) : incrementValue == 0 ? (
                <DashIcon />
              ) : (
                <ChevronDown className=" " />
              )}
              <p className="text-sm">{incrementValue} more</p>
            </span>
            <p className="font-normal text-gray-500 text-sm">since Yesterday</p>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoCard;

export const InfoCardSkeleton = () => {
  return (
    <div className="w-full flex flex-1 min-w-[250px]">
      <div className="w-full flex flex-col gap-3 pl-2 border rounded-md shadow-sm">
        <Skeleton className="w-[70%] h-5 mt-4 " />
        <Skeleton className="w-[50%] h-5" />

        <div className="flex items-center justify-start gap-2 w-full mb-4  p-0">
          <Skeleton className="w-[40%] h-5" />
          <Skeleton className="w-[25%] h-5 pr-3 mr-4" />
        </div>
      </div>
    </div>
  );
};
