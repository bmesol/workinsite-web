import { NameField } from "@/shared/components/FormFields/NameField";
import { Button } from "@/shared/components/ui/button";
import { useWorkerRoleCreateForm } from "./useWorkerRoleCreateForm";
import type { WorkerRoleCreateFormProps } from "../../DTOs/WorkRoleProps";

const WorkerRoleCreateForm = (props: WorkerRoleCreateFormProps) => {
  const {
    name,
    setName,
    salaryPerShift,
    setSalaryPerShift,
    hoursPerShift,
    setHoursPerShift,
    handleAdd,
    error,
  } = useWorkerRoleCreateForm(props);

  return (
    <div className="flex flex-col gap-4">

      {/* Worker Role Name */}
      <NameField
        label="Worker Role"
        inputValue={name}
        setInputValue={setName}
        errorMessage={error.name}
        placeholder="Enter Worker Role"
        required={true}
      />

      {/* Salary Per Shift */}
      <NameField
        label="Salary Per Shift"
        inputValue={salaryPerShift}
        setInputValue={setSalaryPerShift}
        errorMessage={error.salaryPerShift}
        placeholder="Enter Salary Per Shift"
        required={true}
        regex="^[0-9]*\.?[0-9]*$"  
        length={10}
      />

      {/* Hours Per Shift */}
      <NameField
        label="Hours Per Shift"
        inputValue={hoursPerShift}
        setInputValue={setHoursPerShift}
        errorMessage={error.hoursPerShift}
        placeholder="Enter Hours Per Shift"
        required={true}
        regex="^[0-9]*$"  
        length={2}
      />

      <Button onClick={handleAdd}>Add</Button>
    </div>
  );
};

export default WorkerRoleCreateForm;