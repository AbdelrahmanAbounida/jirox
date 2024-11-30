import MyTasks from "@/components/my-tasks";

interface PageProps {
  params: {
    workspaceId: string;
  };
}

const Tasks = ({ params }: PageProps) => {
  return <MyTasks workspaceId={params.workspaceId} />;
};

export default Tasks;
