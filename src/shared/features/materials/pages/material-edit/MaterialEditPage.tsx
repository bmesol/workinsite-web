import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Header } from '@/shared/components/Header/Header';
import { NameField } from '@/shared/components/FormFields/NameField';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import { useMaterialEdit } from './useMaterialEdit';
import { UnsavedChangesDialog } from '@/shared/components/UnsavedChangesDialog/UnsavedChangesDialog';
import { usePermission } from '@/shared/hooks/usePermission';
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { SkField, SkButtons } from '@/shared/components/EditPageSkeleton/EditPageSkeleton';

const MaterialEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { canEdit } = usePermission();
  const editable = canEdit('Material');
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
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
    showUnsavedDialog,
    fetchUnits,
    handleUnitChange,
    loading,
  } = useMaterialEdit(id!);

  if (loading) {
    return (
      <div className="w-full min-h-screen px-4 pb-10">
        <Header title={t('Edit Material')} />
        <Card className="mt-4 p-6">
          <div className="flex flex-col gap-4">
            <SkField />
            <SkField />
            <SkField />
            <SkButtons />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* Header */}
      <Header title={t('Edit Material')} />

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
            isDisabled={!editable}
          />

          {/* Unit Combobox */}
          <ComboboxField
            id="unit"
            label={t('Unit')}
            items={unitDetails}
            selectedValue={unitId}
            onValueChange={handleUnitChange}
            onSearch={fetchUnits}
            required={true}
            error={error.unitId}
            disabled={!editable}
          />

          {/* HSN Code */}
          <NameField
            label={t('HSN Code')}
            inputValue={hsnCode}
            setInputValue={setHsnCode}
            placeholder={t('Enter HSN code')}
            length={15}
            regex="^[0-9]*$"
            isDisabled={!editable}
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

export { MaterialEditPage };
