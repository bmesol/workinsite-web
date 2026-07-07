import { Card } from '@/shared/components/ui/card';
import { Header } from '@/shared/components/Header/Header';
import { NameField } from '@/shared/components/FormFields/NameField';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import { useCuringTypeCreate } from './useCuringTypeCreate';
import { usePermission } from '@/shared/hooks/usePermission';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

export const CuringTypeCreationPage = () => {
  const { canEdit } = usePermission();
  const editable = canEdit('Curing Types');
  const { t } = useLanguage();

  const {
    curingType, setCuringType,
    remark, setRemark,
    error,
    handleSubmission,
    handleBack,
  } = useCuringTypeCreate();

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      <Header title={t('New Curing Type')} />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          <NameField
            label={t('Curing Type')}
            inputValue={curingType}
            setInputValue={setCuringType}
            placeholder={t('Enter Curing Type')}
            required
            errorMessage={error.curingType}
            isDisabled={!editable}
          />

          <TextareaField
            label={t('Remark')}
            inputValue={remark}
            setInputValue={setRemark}
            placeholder={t('Enter Remark')}
            isDisabled={!editable}
          />

          <FormSubmissionButtons
            label={t('Create')}
            onSave={handleSubmission}
            onCancel={handleBack}
            disabled={!editable}
          />

        </div>
      </Card>

    </div>
  );
};
