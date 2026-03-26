import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button"; 

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600">Page Not Found</h2>
        <p className="text-gray-500">Sorry, the page you are looking for does not exist.</p>
        <Button asChild>
          <Link to="/">Go to Home Page</Link>
        </Button>
      </div>
    </div>
  );
};

export { NotFoundPage };