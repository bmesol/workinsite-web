// import { NameField } from "@/shared/components/FormFields/NameField";
// import { Button } from "@/shared/components/ui/button";
// import type { WorkTypeCreateFormProps } from "../../DTOs/WorkTypeProps";
// import { useWorkType } from "./useWorkTypeCreateForm";
// import { useLanguage } from '@/shared/hooks/useLanguageContext';

// const WorkTypeCreateForm = (props: WorkTypeCreateFormProps) => {
//   const { t } = useLanguage();
//   const {
//     workType,
//     setWorkType,
//     handleAdd,
//     error,
//   } = useWorkType(props);

//   return (
//     <div className="flex flex-col gap-4">
//       <NameField
//         label={t('Work Type')}
//         inputValue={workType}
//         setInputValue={setWorkType}
//         errorMessage={error}
//         placeholder={t('Enter Work Type')}
//         required={true}
//       />
//       <Button onClick={handleAdd}>{t('Add')}</Button>
//     </div>
//   );
// };

// export default WorkTypeCreateForm;

import { NameField } from "@/shared/components/FormFields/NameField";
import { Button } from "@/shared/components/ui/button";
import type { WorkTypeCreateFormProps } from "../../DTOs/WorkTypeProps";
import { useWorkType } from "./useWorkTypeCreateForm";
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";

const WorkTypeCreateForm = (props: WorkTypeCreateFormProps) => {
  const { t } = useLanguage();
  const {
    workType,
    setWorkType,
    unitId,
    unitDetails,
    fetchUnits,
    handleUnitChange,
    handleAdd,
    error,
  } = useWorkType(props);

  return (
    <div className="flex flex-col gap-4">
      <NameField
        label={t('Work Type')}
        inputValue={workType}
        setInputValue={setWorkType}
        errorMessage={error.name}
        placeholder={t('Enter Work Type')}
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
      <Button onClick={handleAdd}>{t('Add')}</Button>
    </div>
  );
};

export default WorkTypeCreateForm;
