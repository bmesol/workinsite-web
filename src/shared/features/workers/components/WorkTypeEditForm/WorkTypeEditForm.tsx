import { NameField } from "@/shared/components/FormFields/NameField";
import { Button } from "@/shared/components/ui/button";
import { useWorkTypeEditForm } from "./useWorkTypeEditForm";
import type { WorkTypeEditFormProps } from "../../DTOs/WorkTypeProps";

const WorkTypeEditForm = (props: WorkTypeEditFormProps) => {
  const { name, setName, error, handleSave } = useWorkTypeEditForm(props);

  return (
    <div className="flex flex-col gap-4">
      <NameField
        label="Work Type"
        inputValue={name}
        setInputValue={setName}
        errorMessage={error}
        placeholder="Enter work type"
        required={true}
      />
      <Button onClick={handleSave}>Update</Button>
    </div>
  );
};

export default WorkTypeEditForm;