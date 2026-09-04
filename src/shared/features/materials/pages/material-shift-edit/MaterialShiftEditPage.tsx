import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
import { useMaterialShiftEdit } from './useMaterialShiftEdit';
import { usePermission } from '@/shared/hooks/usePermission';
import { MaterialShiftUrls } from '../../utils/urls';
import { cn } from '@/shared/components/lib/utils';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

export const MaterialShiftEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { canEdit } = usePermission();
  const editable = canEdit('Material Shift');

  if (!id) return null;

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
    loading,
    handleSubmission,
    handleBack,
    maximumAllowedQuantity,
    isFetchingMaterials,
    showUnsavedDialog,
    setShowUnsavedDialog,
    fetchMaterialShift,
    setError,
    initialError,
  } = useMaterialShiftEdit(id);

  const QuantityBadge = () => {
    if (!materialId || maximumAllowedQuantity === null) return null;

    const entered = parseFloat(quantity);
    const max = parseFloat(maximumAllowedQuantity);
    const isExceeded = !isNaN(entered) && !isNaN(max) && entered > max;

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
          ? `⚠  Exceeds maximum allowed (${maximumAllowedQuantity})`
          : `✓  Max allowed: ${maximumAllowedQuantity}`}
      </div>
    );
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

      {/* ── Header ── */}
      <Header title={t("Edit Material Shift")} />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* ── Row 1: Date + Source Site ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label={t("Date")}
              date={date}
              onDateChange={setDate}
              required
              errorMessage={error.date}
              disable={!editable}
            />
            <ComboboxField
              id="sourceSite"
              label={t("Source Site")}
              items={sourceSiteDetails}
              selectedValue={sourceSiteId}
              onValueChange={setSourceSiteId}
              onSearch={fetchSourceSites}
              required
              error={error.sourceSiteId}
              disabled={!editable}
            />
          </div>

          {/* ── Row 2: Material + Quantity ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Material */}
            <div>
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
                  disabled={!editable}
                />
              )}
            </div>

            {/* Quantity + Badge */}
            <div className="flex flex-col gap-2">
              <NameField
                label={t("Quantity")}
                inputValue={quantity}
                setInputValue={setQuantity}
                placeholder={
                  maximumAllowedQuantity !== null
                    ? `Max: ${maximumAllowedQuantity}`
                    : t("Enter Quantity")
                }
                required
                regex="^[0-9]*(\.[0-9]*)?$"
                errorMessage={error.quantity}
                isDisabled={!editable}
              />
              <QuantityBadge />
            </div>
          </div>

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
            disabled={!editable}
          />

          {/* ── Notes ── */}
          <TextareaField
            label={t("Notes")}
            inputValue={notes}
            setInputValue={setNotes}
            placeholder={t("Enter your Notes")}
            isDisabled={!editable}
          />

          {/* ── Save / Cancel ── */}
          <FormSubmissionButtons
            onSave={handleSubmission}
            onCancel={handleBack}
            disabled={!editable}
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
                fetchMaterialShift();
                setError(initialError);
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
