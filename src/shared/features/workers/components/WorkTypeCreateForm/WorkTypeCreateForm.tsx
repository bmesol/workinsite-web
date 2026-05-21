import { NameField } from "@/shared/components/FormFields/NameField";
import { Button } from "@/shared/components/ui/button";
import type { WorkTypeCreateFormProps } from "../../DTOs/WorkTypeProps";
import { useWorkType } from "./useWorkTypeCreateForm";

const WorkTypeCreateForm = (props: WorkTypeCreateFormProps) => {
  const {
    workType,
    setWorkType,
    handleAdd,
    error,
  } = useWorkType(props);

  return (
    <div className="flex flex-col gap-4">
      <NameField
        label="Work Type"
        inputValue={workType}
        setInputValue={setWorkType}
        errorMessage={error}
        placeholder="Enter Work Type"
        required={true}
      />
      <Button onClick={handleAdd}>Add</Button>
    </div>
  );
};

export default WorkTypeCreateForm;