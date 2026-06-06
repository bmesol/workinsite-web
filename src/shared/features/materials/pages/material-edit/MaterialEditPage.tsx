import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { Header } from '@/shared/components/Header/Header';
import { NameField } from '@/shared/components/FormFields/NameField';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import { useMaterialEdit } from './useMaterialEdit';
import { usePermission } from '@/shared/hooks/usePermission';

const MaterialEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const { canEdit } = usePermission();
  const editable = canEdit('Material');

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
    handleUnitChange,
    loading,
  } = useMaterialEdit(id!);

  const onBackPress = () => {
    const hasChanges = handleBackPress();
    if (hasChanges) setShowExitDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* Header */}
      <Header title="Edit Material" />

      {/* Form Card */}
      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* Material Name */}
          <NameField
            label="Material Name"
            inputValue={name}
            setInputValue={setName}
            placeholder="Enter material name"
            required={true}
            errorMessage={error.name}
            isDisabled={!editable}
          />

          {/* Unit Combobox */}
          <ComboboxField
            id="unit"
            label="Unit"
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
            label="HSN Code"
            inputValue={hsnCode}
            setInputValue={setHsnCode}
            placeholder="Enter HSN code"
            length={15}
            regex="^[0-9]*$"
            isDisabled={!editable}
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
              You have unsaved changes. Do you want to save them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => {
                setShowExitDialog(false);
                handleSaveAndExit();
              }}
            >
              Save
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowExitDialog(false);
                handleConfirmExit();
              }}
            >
              Exit Without Saving
            </Button>
            <AlertDialogCancel onClick={() => setShowExitDialog(false)}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export { MaterialEditPage };