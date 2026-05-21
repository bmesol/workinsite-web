import { NameField } from "@/shared/components/FormFields/NameField";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
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

      <NameField
        label="Worker Role"
        inputValue={name}
        setInputValue={setName}
        errorMessage={error.name}
        placeholder="Enter Worker Role"
        required={true}
      />

      {/* Salary Per Shift */}
      <div className="flex flex-col gap-1">
        <Label>
          Salary Per Shift <span className="text-destructive">*</span>
        </Label>
        <Input
          type="number"
          inputMode="numeric"
          placeholder="Enter Salary Per Shift"
          value={salaryPerShift}
          onChange={(e) => setSalaryPerShift(e.target.value)}
          maxLength={10}
        />
        {error.salaryPerShift && (
          <p className="text-sm text-destructive">{error.salaryPerShift}</p>
        )}
      </div>

      {/* Hours Per Shift */}
      <div className="flex flex-col gap-1">
        <Label>
          Hours Per Shift <span className="text-destructive">*</span>
        </Label>
        <Input
          type="number"
          inputMode="numeric"
          placeholder="Enter Hours Per Shift"
          value={hoursPerShift}
          onChange={(e) => setHoursPerShift(e.target.value)}
          maxLength={2}
        />
        {error.hoursPerShift && (
          <p className="text-sm text-destructive">{error.hoursPerShift}</p>
        )}
      </div>

      <Button onClick={handleAdd}>Add</Button>
    </div>
  );
};

export default WorkerRoleCreateForm;