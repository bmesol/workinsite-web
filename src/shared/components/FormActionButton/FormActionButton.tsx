import { FormInput } from "../FormInput/FormInput";
import { Button } from "@/shared/components/ui/button";
import { PlusCircle, Pencil, BookUser } from "lucide-react";
import { FieldLabel } from "@/shared/components/FormFields/FieldLabel";

const FormActionButton = (props: {
  heading: string;
  label: string;
  onClick: () => void;
  isAddDisabled?: boolean;
  isColsTwo?: boolean;
  required?: boolean;
  errorMessage?: string;
  iconType?: string;
}) => {
  const { heading, label, onClick, isAddDisabled, isColsTwo = false, required, errorMessage, iconType } = props;

  const icon =
    iconType === "contacts" ? (
      <BookUser className="h-4 w-4 text-white" />
    ) : label.toLowerCase() === "edit" ? (
      <Pencil className="h-4 w-4 text-white" />
    ) : (
      <PlusCircle className="h-4 w-4 text-white" />
    );

  return (
    <div className="flex flex-col gap-1">
      <FormInput className={`${isColsTwo ? "w-full" : "md:w-2/3 lg:w-1/2"} flex-row justify-between items-center`}>
        <FieldLabel required={required}>{heading}</FieldLabel>
        <Button
          type="button"
          variant="secondary"
          onClick={onClick}
          disabled={isAddDisabled}
          className="flex items-center gap-2 text-white cursor-pointer"
        >
          {icon}
          {label}
        </Button>
      </FormInput>

      {errorMessage && (
        <p className="text-sm text-red-500 mt-0.5">{errorMessage}</p>
      )}
    </div>
  );
};
export { FormActionButton };