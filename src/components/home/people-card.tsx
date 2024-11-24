import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { GearIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

const ProjectsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center w-full gap-2 justify-between">
          <p>People (2)</p>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="shadow-sm w-8 h-8  rounded-md"
          >
            <GearIcon className="" />
          </Button>
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        {/** List of People */}
        <div className="flex w-full flex-wrap gap-3">
          <PersonCard name="Antonio" email="anotonio@gmail.com" />
          <PersonCard name="abdel" email="abdel@gmail.com" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsCard;

const PersonCard = ({ name, email }: { name: string; email: string }) => (
  <div className=" min-w-[210px] rounded-lg p-3 flex flex-col justify-center items-center">
    <div className="bg-gray-200/80 flex items-center justify-center font-semibold rounded-full w-11 h-11">
      <span className="capitalize ">{name && name[0]}</span>
    </div>
    <p className="text-md font-medium capitalize">{name}</p>
    <p className="text-gray-400 text-sm">{email}</p>
  </div>
);
