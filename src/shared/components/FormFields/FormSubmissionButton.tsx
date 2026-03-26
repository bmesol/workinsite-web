import { Button } from "@/shared/components/ui/button";
import { FormInput } from "../FormInput/FormInput";

const FormSubmissionButtons = (props: {
  label?: string;
  onSave: () => void;
  onCancel: () => void;
  className?: string;
}) => {
  return (
    <FormInput className={props.className}>
      <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
        <Button
          variant="outline"
          onClick={() => props.onCancel()}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          onClick={() => props.onSave()}
        >
          {props.label || "Save"}
        </Button>
      </div>
    </FormInput>
  );
};

export { FormSubmissionButtons };