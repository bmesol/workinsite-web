import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

const UserStatus = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="mr-2">
          <Info className="w-6 h-6" />
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="bg-white text-black border border-gray-200 shadow-md" 
        >
          <div className="p-2 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span className="text-sm">Active User</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span className="text-sm">In Active User</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { UserStatus };