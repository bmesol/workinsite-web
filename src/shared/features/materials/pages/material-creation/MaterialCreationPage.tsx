import { Card } from '@/shared/components/ui/card';
import { useMaterialCreation } from './useMaterialCreation';
import { Header } from '@/shared/components/Header/Header';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import { NameField } from '@/shared/components/FormFields/NameField';
import { UnsavedChangesDialog } from '@/shared/components/UnsavedChangesDialog/UnsavedChangesDialog';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const MaterialCreationPage = () => {
  const { t } = useLanguage();

  const {
    name,
    setName,
    unitId,
    setUnitId,
    unitDetails,
    hsnCode,
    setHsnCode,
    error,
    handleSubmission,
    handleCancel,
    fetchUnits,
    showUnsavedDialog,
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
  } = useMaterialCreation();

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* Header */}
      <Header title={t('Create Material')} />

      {/* Form Card */}
      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* Material Name */}
          <NameField
            label={t('Material Name')}
            inputValue={name}
            setInputValue={setName}
            placeholder={t('Enter material name')}
            required={true}
            errorMessage={error.name}
          />

          {/* Unit Combobox */}
          <ComboboxField
            id="unit"
            label={t('Unit')}
            items={unitDetails}
            selectedValue={unitId}
            onValueChange={setUnitId}
            onSearch={fetchUnits}
            required={true}
            error={error.unitId}
          />

          {/* HSN Code */}
          <NameField
            label={t('HSN Code')}
            inputValue={hsnCode}
            setInputValue={setHsnCode}
            placeholder={t('Enter HSN code')}
            length={15}
            regex="^[0-9]*$"
          />

          {/* Save / Cancel Buttons */}
          <FormSubmissionButtons
            onSave={() => handleSubmission()}
            onCancel={handleCancel}
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

export { MaterialCreationPage };
