import { FormInput } from "../FormInput/FormInput";
import { Button } from "@/shared/components/ui/button";
import { Asterisk, PlusCircle, Pencil } from "lucide-react";

const FormActionButton = (props: {
  heading: string;
  label: string;
  onClick: () => void;
  isAddDisabled?: boolean;
  isColsTwo?: boolean;
  required?: boolean;
  errorMessage?: string; 
}) => {
  const { heading, label, onClick, isAddDisabled, isColsTwo = false, required, errorMessage } = props;

  const icon = label.toLowerCase() === "edit"
    ? <Pencil className="h-4 w-4 text-white" />
    : <PlusCircle className="h-4 w-4 text-white" />;

  return (
    <div className="flex flex-col gap-1">
      <FormInput className={`${isColsTwo ? "w-full" : "md:w-2/3 lg:w-1/2"} flex-row justify-between items-center`}>
        <div className="flex items-center gap-1">
          <span className="text-base font-medium text-black">{heading}</span>
          {required && (
            <sup>
              <Asterisk className="h-3 w-3 text-red-500" />
            </sup>
          )}
        </div>
        <Button
          variant="secondary"
          onClick={onClick}
          disabled={isAddDisabled}
          className="flex items-center gap-2 text-white cursor-pointer"
        >
          {icon}
          {label}
        </Button>
      </FormInput>
      {/* ✅ Error message shown below the button row */}
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
};

export { FormActionButton };