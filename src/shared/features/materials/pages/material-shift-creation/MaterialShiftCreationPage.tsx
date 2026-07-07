import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { NameField } from '@/shared/components/FormFields/NameField';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
import { Header } from '@/shared/components/Header/Header';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared/components/ui/alert-dialog';
import { useMaterialShiftCreation } from './useMaterialShiftCreation';
import { MaterialShiftUrls } from '../../utils/urls';
import { cn } from '@/shared/components/lib/utils';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const MaterialShiftCreationPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const {
    date, setDate,
    materialId, setMaterialId,
    sourceSiteId, setSourceSiteId,
    targetSiteId, setTargetSiteId,
    quantity, setQuantity,
    notes, setNotes,
    sourceSiteDetails,
    targetSiteDetails,
    materialDetails,
    fetchSourceSites,
    fetchTargetSites,
    fetchMaterials,
    error,
    handleSubmission,
    handleBack,
    availableQuantity,
    isFetchingMaterials,
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  } = useMaterialShiftCreation();

  const AvailabilityBadge = () => {
    if (!materialId || availableQuantity === null) return null;

    const entered = parseFloat(quantity);
    const available = parseFloat(availableQuantity);
    const isExceeded = !isNaN(entered) && !isNaN(available) && entered > available;

    return (
      <div
        className={cn(
          'self-start px-2.5 py-1 rounded-md border text-xs font-medium -mt-1',
          isExceeded
            ? 'bg-red-50 border-red-200 text-red-600'
            : 'bg-blue-50 border-blue-200 text-blue-700',
        )}
      >
        {isExceeded
          ? `⚠  Exceeds available stock (${availableQuantity})`
          : `✓  Available: ${availableQuantity}`}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* ── Header ── */}
      <Header title={t("Create Material Shift")} />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* ── Date ── */}
          <DatePicker
            label={t("Date")}
            date={date}
            onDateChange={setDate}
            required
            defaultDate
            errorMessage={error.date}
          />

          {/* ── Source Site ── */}
          <ComboboxField
            id="sourceSite"
            label={t("Source Site")}
            items={sourceSiteDetails}
            selectedValue={sourceSiteId}
            onValueChange={setSourceSiteId}
            onSearch={fetchSourceSites}
            required
            error={error.sourceSiteId}
          />

          {/* ── Material ── */}
          {isFetchingMaterials ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <Loader2 className="animate-spin h-4 w-4 text-blue-600" />
              Loading available materials…
            </div>
          ) : (
            <ComboboxField
              id="material"
              label={t("Material")}
              items={materialDetails}
              selectedValue={materialId}
              onValueChange={setMaterialId}
              onSearch={fetchMaterials}
              required
              error={error.materialId}
              disabled={!sourceSiteId || materialDetails.length === 0}
            />
          )}

          {/* ── Quantity ── */}
          <NameField
            label={t("Quantity")}
            inputValue={quantity}
            setInputValue={setQuantity}
            placeholder={
              availableQuantity !== null
                ? `Max: ${availableQuantity}`
                : t("Enter Quantity")
            }
            required
            regex="^[0-9]*(\.[0-9]*)?$"
            errorMessage={error.quantity}
            isDisabled={!materialId}
          />

          {/* ── Availability Badge ── */}
          <AvailabilityBadge />

          {/* ── Target Site ── */}
          <ComboboxField
            id="targetSite"
            label={t("Target Site")}
            items={targetSiteDetails}
            selectedValue={targetSiteId}
            onValueChange={setTargetSiteId}
            onSearch={fetchTargetSites}
            required
            error={error.targetSiteId}
          />

          {/* ── Notes ── */}
          <TextareaField
            label={t("Notes")}
            inputValue={notes}
            setInputValue={setNotes}
            placeholder={t("Enter your Notes")}
          />

          {/* ── Save / Cancel ── */}
          <FormSubmissionButtons
            onSave={handleSubmission}
            onCancel={handleBack}
          />

        </div>
      </Card>

      {/* ── Unsaved Changes Dialog ── */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save them before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                resetFormFields();
                navigate(MaterialShiftUrls.list);
              }}
            >
              {t("Exit Without Saving")}
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={() => {
                  handleSubmission();
                  setShowUnsavedDialog(false);
                }}
              >
                {t("Save")}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export { MaterialShiftCreationPage };
