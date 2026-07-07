import { NameField } from "@/shared/components/FormFields/NameField";
import { Button } from "@/shared/components/ui/button";
import { useWorkTypeEditForm } from "./useWorkTypeEditForm";
import type { WorkTypeEditFormProps } from "../../DTOs/WorkTypeProps";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const WorkTypeEditForm = (props: WorkTypeEditFormProps) => {
  const { t } = useLanguage();
  const { name, setName, error, handleSave } = useWorkTypeEditForm(props);

  return (
    <div className="flex flex-col gap-4">
      <NameField
        label={t('Work Type')}
        inputValue={name}
        setInputValue={setName}
        errorMessage={error}
        placeholder={t('Enter work type')}
        required={true}
      />
      <Button onClick={handleSave}>{t('Update')}</Button>
    </div>
  );
};

export default WorkTypeEditForm;
