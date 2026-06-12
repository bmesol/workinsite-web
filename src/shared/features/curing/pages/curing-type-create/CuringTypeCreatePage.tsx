import { Card } from '@/shared/components/ui/card';
import { Header } from '@/shared/components/Header/Header';
import { NameField } from '@/shared/components/FormFields/NameField';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import { useCuringTypeCreate } from './useCuringTypeCreate';
import { usePermission } from '@/shared/hooks/usePermission';

export const CuringTypeCreationPage = () => {
  const { canEdit } = usePermission();
  const editable = canEdit('Curing Types');

  const {
    curingType, setCuringType,
    remark, setRemark,
    error,
    handleSubmission,
    handleBack,
  } = useCuringTypeCreate();

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* ── Header (no back button) ── */}
      <Header title="New Curing Type" />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* ── Curing Type ── */}
          <NameField
            label="Curing Type"
            inputValue={curingType}
            setInputValue={setCuringType}
            placeholder="Enter Curing Type"
            required
            errorMessage={error.curingType}
            isDisabled={!editable}
          />

          {/* ── Remark ── */}
          <TextareaField
            label="Remark"
            inputValue={remark}
            setInputValue={setRemark}
            placeholder="Enter Remark"
            isDisabled={!editable}
          />

          {/* ── Create / Cancel ── */}
          <FormSubmissionButtons
            label="Create"
            onSave={handleSubmission}
            onCancel={handleBack}
            disabled={!editable}
          />

        </div>
      </Card>

    </div>
  );
};