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
    <div className="w-full flex flex-1 min-w-[250px]">
      <Card className="w-full">
        <CardHeader className="justify-between flex flex-row">
          <div className="flex flex-col gap-2 ">
            <CardTitle className="text-gray-600  font-bold capitalize mt-3">
              {title}
            </CardTitle>
            <CardDescription className="font-medium text-xl text-black ">
              {value}
            </CardDescription>
          </div>
          {Icon}
        </CardHeader>
        <CardContent>
          <p className="flex items-center">
            <span
              className={cn(
                incrementValue > 0 ? "text-green-500" : "text-red-500",
                "flex items-center mr-2"
              )}
            >
              {incrementValue > 0 ? (
                <ChevronUp className="mr-1" />
              ) : (
                <ChevronDown className="mr-1" />
              )}
              {incrementValue}%
            </span>
            since Yesterday
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoCard;
