// 

import { NameField } from "@/shared/components/FormFields/NameField";
import { Button } from "@/shared/components/ui/button";
import { useWorkTypeEditForm } from "./useWorkTypeEditForm";
import type { WorkTypeEditFormProps } from "../../DTOs/WorkTypeProps";
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";

const WorkTypeEditForm = (props: WorkTypeEditFormProps) => {
  const { t } = useLanguage();
  const {
    name,
    setName,
    error,
    unitId,
    unitDetails,
    fetchUnits,
    handleUnitChange,
    handleSave,
  } = useWorkTypeEditForm(props);

  return (
    <div className="flex flex-col gap-4">
      <NameField
        label={t('Work Type')}
        inputValue={name}
        setInputValue={setName}
        errorMessage={error.name}
        placeholder={t('Enter work type')}
        required={true}
      />
      <ComboboxField
        id="unit"
        label={t('Unit')}
        items={unitDetails}
        selectedValue={unitId}
        onValueChange={handleUnitChange}
        onSearch={fetchUnits}
        required
        error={error.unit}
      />
      <Button onClick={handleSave}>{t('Update')}</Button>
    </div>
  );
};

export default WorkTypeEditForm;