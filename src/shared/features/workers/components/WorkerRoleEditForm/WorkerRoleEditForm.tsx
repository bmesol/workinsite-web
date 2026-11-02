import { NameField } from "@/shared/components/FormFields/NameField";
import { Button } from "@/shared/components/ui/button";
import { useWorkerRoleEditForm } from "./useWorkerRoleEditForm";
import type { WorkerRoleEditFormProps } from "../../DTOs/WorkRoleProps";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const WorkerRoleEditForm = (props: WorkerRoleEditFormProps) => {
  const { t } = useLanguage();
  const {
    name,
    setName,
    salaryPerShift,
    setSalaryPerShift,
    hoursPerShift,
    setHoursPerShift,
    error,
    handleSave,
  } = useWorkerRoleEditForm(props);

  return (
    <div className="flex flex-col gap-4">

      <NameField
        label={t('Worker Role')}
        inputValue={name}
        setInputValue={setName}
        errorMessage={error.name}
        placeholder={t('Enter Worker Role')}
        required={true}
      />

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

      <Button onClick={handleSave}>{t('Update')}</Button>
    </div>
  );
};

export default WorkerRoleEditForm;
