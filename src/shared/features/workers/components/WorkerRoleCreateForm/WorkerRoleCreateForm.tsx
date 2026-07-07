import { NameField } from "@/shared/components/FormFields/NameField";
import { Button } from "@/shared/components/ui/button";
import { useWorkerRoleCreateForm } from "./useWorkerRoleCreateForm";
import type { WorkerRoleCreateFormProps } from "../../DTOs/WorkRoleProps";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const WorkerRoleCreateForm = (props: WorkerRoleCreateFormProps) => {
  const { t } = useLanguage();
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
        label={t('Worker Role')}
        inputValue={name}
        setInputValue={setName}
        errorMessage={error.name}
        placeholder={t('Enter Worker Role')}
        required={true}
      />

      {/* Salary Per Shift */}
      <NameField
        label={t('Salary Per Shift')}
        inputValue={salaryPerShift}
        setInputValue={setSalaryPerShift}
        errorMessage={error.salaryPerShift}
        placeholder={t('Enter Salary Per Shift')}
        required={true}
        regex="^[0-9]*\.?[0-9]*$"
        length={10}
      />

      {/* Hours Per Shift */}
      <NameField
        label={t('Hours Per Shift')}
        inputValue={hoursPerShift}
        setInputValue={setHoursPerShift}
        errorMessage={error.hoursPerShift}
        placeholder={t('Enter Hours Per Shift')}
        required={true}
        regex="^[0-9]*$"
        length={2}
      />

      <Button onClick={handleAdd}>{t('Add')}</Button>
    </div>
  );
};

export default WorkerRoleCreateForm;
