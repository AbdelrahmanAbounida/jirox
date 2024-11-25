import ProjectTitle from "@/components/tasks/project-title";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const ProjectsList = () => {
  const currentPath = usePathname();

  return (
    <div>
      <div className=" flex flex-col gap-1 items-start mt-2 ">
        {[1, 2].map((item, index) => (
          <Link
            href={"/projects/" + item}
            className="my-1 cursor-pointer w-full hover:bg-gray-50"
          >
            <ProjectTitle
              title="Mobile App Development"
              className={cn(
                "text-gray-600  p-2 rounded-md   text-wrap truncate ...",
                currentPath == "/projects/" + item.toString() && "bg-white"
              )}
              key={index}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
