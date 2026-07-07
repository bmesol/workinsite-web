import { useWorkerRoleEditForm } from "./useWorkerRoleEditForm";
import type { WorkerRoleEditFormProps } from "../../DTOs/WorkRoleProps";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
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

      {/* Worker Role */}
      <div className="flex flex-col gap-1">
        <Label>{t('Worker Role')}</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter worker role"
          maxLength={50}
        />
        {error.name && (
          <span className="text-xs text-destructive">{error.name}</span>
        )}
      </div>

      {/* Salary Per Shift */}
      <div className="flex flex-col gap-1">
        <Label>{t('Salary Per Shift')}</Label>
        <Input
          value={salaryPerShift}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*\.?\d*$/.test(val)) setSalaryPerShift(val); // numberRegex equivalent
          }}
          placeholder={t('Enter Salary Per Shift')}
          inputMode="numeric"
          maxLength={10}
        />
        {error.salaryPerShift && (
          <span className="text-xs text-destructive">{error.salaryPerShift}</span>
        )}
      </div>

      {/* Hours Per Shift */}
      <div className="flex flex-col gap-1">
        <Label>{t('Hours Per Shift')}</Label>
        <Input
          value={hoursPerShift}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) setHoursPerShift(val); // numberRegex equivalent
          }}
          placeholder={t('Enter Hours Per Shift')}
          inputMode="numeric"
          maxLength={2}
        />
        {error.hoursPerShift && (
          <span className="text-xs text-destructive">{error.hoursPerShift}</span>
        )}
      </div>

      {/* Submit */}
      <Button onClick={handleSave} className="w-full">
        {t('Update')}
      </Button>

    </div>
  );
};

export default WorkerRoleEditForm;
