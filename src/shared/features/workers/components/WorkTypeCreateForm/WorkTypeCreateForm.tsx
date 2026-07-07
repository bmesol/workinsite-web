import { NameField } from "@/shared/components/FormFields/NameField";
import { Button } from "@/shared/components/ui/button";
import type { WorkTypeCreateFormProps } from "../../DTOs/WorkTypeProps";
import { useWorkType } from "./useWorkTypeCreateForm";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const WorkTypeCreateForm = (props: WorkTypeCreateFormProps) => {
  const { t } = useLanguage();
  const {
    workType,
    setWorkType,
    handleAdd,
    error,
  } = useWorkType(props);

  return (
    <div className="flex flex-col gap-4">
      <NameField
        label={t('Work Type')}
        inputValue={workType}
        setInputValue={setWorkType}
        errorMessage={error}
        placeholder={t('Enter Work Type')}
        required={true}
      />
      <Button onClick={handleAdd}>{t('Add')}</Button>
    </div>
  );
};

export default WorkTypeCreateForm;
