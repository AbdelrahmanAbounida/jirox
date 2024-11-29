interface NavbarHeaderProps {
  pathname: string;
  title: string;
  description: string;
}

export const NAVBAR_HEADERS: NavbarHeaderProps[] = [
  {
    pathname: "home",
    title: "Home",
    description: "Monitor all of your projects and tasks here",
  },
  {
    pathname: "tasks",
    title: "My Tasks",
    description: "View all of your tasks here",
  },
  {
    pathname: "projects",
    title: "Project",
    description: "View all of your project tasks here",
  },
];
