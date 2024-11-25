import React from "react";

interface ProjectPageParams {
  params: {
    projectId: string;
  };
}

const ProjectPage = ({ params }: ProjectPageParams) => {
  return (
    <div>{/** TODO:: Show Project Details like tasks list , members  */}</div>
  );
};

export default ProjectPage;
