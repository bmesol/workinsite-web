import { FormInput } from "../FormInput/FormInput";  {/* ✅ add back */}
import { Button } from "@/shared/components/ui/button";
import { Asterisk, PlusCircle } from "lucide-react";

const FormActionButton = (props: {
  heading: string;
  label: string;
  onClick: () => void;
  isAddDisabled?: boolean;
  isColsTwo?: boolean;
  required?: boolean;
}) => {
  const { heading, label, onClick, isAddDisabled, isColsTwo = false, required } = props;

  return (
    <FormInput className={`${isColsTwo ? "w-full" : "md:w-2/3 lg:w-1/2"} flex-row justify-between items-center`}>
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-black">{heading}</span>
        {required && (
          <sup>
            <Asterisk className="h-3 w-3 text-destructive" />
          </sup>
        )}
      </div>
      <Button
        variant="secondary"
        onClick={onClick}
        disabled={isAddDisabled}
        className="flex items-center gap-2 text-white"
      >
        <PlusCircle className="h-4 w-4 text-white" />
        {label}
      </Button>
    </FormInput>
  );
};

export { FormActionButton };