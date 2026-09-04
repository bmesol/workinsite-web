import { useNavigate } from 'react-router-dom';
import { Header } from '@/shared/components/Header/Header';
import { Button } from '@/shared/components/ui/button';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { NameField } from '@/shared/components/FormFields/NameField';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
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
import { useMaterialUsedCreation } from './useMaterialUsedCreation';
import { MaterialUsedUrls } from '../../utils/urls';
import { Loader2 } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const MaterialUsedCreationPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const {
    siteId, setSiteId,
    materialId, setMaterialId,
    quantity, setQuantity,
    notes, setNotes,
    date, setDate,
    workModeId, setWorkModeId,
    siteDetails,
    materialDetails,
    workModeDetails,
    error,
    fetchWorkModes,
    fetchSites,
    fetchMaterials,
    handleSubmission,
    handleBack,
    availableQuantity,
    isFetchingMaterials,
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  } = useMaterialUsedCreation();

  const renderAvailabilityBadge = () => {
    if (!materialId || availableQuantity === null) return null;

    const entered = parseFloat(quantity);
    const available = parseFloat(availableQuantity);
    const isExceeded = !isNaN(entered) && !isNaN(available) && entered > available;

    return (
      <div
        className={`text-xs font-medium px-3 py-1.5 rounded-md border w-fit -mt-1 ${
          isExceeded
            ? 'bg-red-50 border-red-200 text-red-600'
            : 'bg-blue-50 border-blue-200 text-blue-700'
        }`}
      >
        {isExceeded
          ? `⚠ Exceeds available stock (${availableQuantity})`
          : `✓ Available: ${availableQuantity}`}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* ── Header ── */}
      <Header title={t("Create Material Used")} />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* ── Row 1: Date + Site ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label={t("Date")}
              required
              date={date}
              onDateChange={setDate}
              errorMessage={error.date}
              defaultDate
            />
            <ComboboxField
              id="site"
              label={t("Site")}
              required
              items={siteDetails}
              selectedValue={siteId}
              onValueChange={setSiteId}
              onSearch={fetchSites}
              error={error.siteId}
            />
          </div>

          {/* ── Row 2: Material + Quantity ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Material */}
            <div>
              {isFetchingMaterials ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading available materials…</span>
                </div>
              ) : (
                <ComboboxField
                  id="material"
                  label={t("Material")}
                  required
                  items={materialDetails}
                  selectedValue={materialId}
                  onValueChange={setMaterialId}
                  onSearch={fetchMaterials}
                  error={error.materialId}
                  disabled={!siteId || materialDetails.length === 0}
                />
              )}
            </div>

            {/* Quantity + Availability Badge */}
            <div className="flex flex-col gap-2">
              <NameField
                label={t("Quantity")}
                required
                inputValue={quantity}
                setInputValue={setQuantity}
                placeholder={
                  availableQuantity !== null
                    ? `Max: ${availableQuantity}`
                    : t("Enter Quantity")
                }
                errorMessage={error.quantity}
                isDisabled={!materialId}
                regex="^[0-9]*\.?[0-9]*$"
              />
              {renderAvailabilityBadge()}
            </div>
          </div>

          {/* ── Work Mode ── */}
          <ComboboxField
            id="workMode"
            label={t("Work Mode")}
            required
            items={workModeDetails}
            selectedValue={workModeId}
            onValueChange={setWorkModeId}
            onSearch={fetchWorkModes}
            error={error.workModeId}
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
                navigate(MaterialUsedUrls.list);
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

export { MaterialUsedCreationPage };
