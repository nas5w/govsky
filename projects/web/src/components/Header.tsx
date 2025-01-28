import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Github } from "./icons/github";

export const Header = () => {
  return (
    <header className="border-b flex justify-center items-center">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">
            <Link to={`/`}>Govsky</Link>
          </h1>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <a href="https://github.com/nas5w/govsky">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
        </Button>
      </div>
    </header>
  );
};
