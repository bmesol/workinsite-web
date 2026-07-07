import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useMaterialCreation } from './useMaterialCreation';
import { Header } from '@/shared/components/Header/Header';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import { NameField } from '@/shared/components/FormFields/NameField';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const MaterialCreationPage = () => {
  const [showExitDialog, setShowExitDialog] = useState(false);
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
    handleBackPress,
    handleConfirmExit,
    handleSaveAndExit,
    fetchUnits,
  } = useMaterialCreation();

  const onBackPress = () => {
    const hasChanges = handleBackPress();
    if (hasChanges) setShowExitDialog(true);
  };

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
            onCancel={onBackPress}
          />

        </div>
      </Card>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save before exiting?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => {
                setShowExitDialog(false);
                handleSaveAndExit();
              }}
            >
              {t('Save')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowExitDialog(false);
                handleConfirmExit();
              }}
            >
              {t('Exit Without Saving')}
            </Button>
            <AlertDialogCancel onClick={() => setShowExitDialog(false)}>
              {t('Cancel')}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export { MaterialCreationPage };
