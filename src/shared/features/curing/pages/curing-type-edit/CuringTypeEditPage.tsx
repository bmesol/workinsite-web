import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Header } from '@/shared/components/Header/Header';
import { NameField } from '@/shared/components/FormFields/NameField';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import { useCuringTypeEdit } from './useCuringTypeEdit';
import { UnsavedChangesDialog } from '@/shared/components/UnsavedChangesDialog/UnsavedChangesDialog';
import { usePermission } from '@/shared/hooks/usePermission';
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { CuringTypeUrls } from '../../utils/urls';
import { SkField, SkTextarea, SkButtons } from '@/shared/components/EditPageSkeleton/EditPageSkeleton';

export const CuringTypeEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canEdit } = usePermission();
  const editable = canEdit('Curing Types');
  const { t } = useLanguage();

  if (!id) return null;

  const {
    curingType, setCuringType,
    remark, setRemark,
    error,
    loading,
    handleSubmission,
    handleBack,
    showUnsavedDialog,
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
  } = useCuringTypeEdit(id);

  if (loading) {
    return (
      <div className="w-full min-h-screen px-4 pb-10">
        <Header title={t('Edit Curing Type')} />
        <Card className="mt-4 p-6">
          <div className="flex flex-col gap-4">
            <SkField />
            <SkTextarea />
            <SkButtons />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      <Header title={t('Edit Curing Type')} />

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
            onSave={handleSubmission}
            onCancel={handleBack}
            disabled={!editable}
          />

        </div>
      </Card>

      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onKeepEditing={handleKeepEditing}
        onDiscard={handleDiscardChanges}
        onSave={handleSaveFromDialog}
      />

    </div>
  );
};
