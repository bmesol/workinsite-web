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
import { QuantityLimitBadge } from '../../components/QuantityLimitBadge';
import { useMaterialShiftEdit } from './useMaterialShiftEdit';
import { UnsavedChangesDialog } from '@/shared/components/UnsavedChangesDialog/UnsavedChangesDialog';
import { usePermission } from '@/shared/hooks/usePermission';
import { MaterialShiftUrls } from '../../utils/urls';
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { SkRow2, SkField, SkTextarea, SkButtons } from '@/shared/components/EditPageSkeleton/EditPageSkeleton';

const MaterialShiftEditContent = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { canEdit } = usePermission();
  const editable = canEdit('Material Shift');

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
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
  } = useMaterialShiftEdit(id);

  if (loading) {
    return (
      <div className="w-full min-h-screen px-4 pb-10">
        <Header title={t('Edit Material Shift')} />
        <Card className="mt-4 p-6">
          <div className="flex flex-col gap-4">
            <SkRow2 />
            <SkRow2 />
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
      <Header title={t('Edit Material Shift')} />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">
          {/* Row 1: Date + Source Site */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label={t('Date')}
              date={date}
              onDateChange={setDate}
              required
              errorMessage={error.date}
              disable={!editable}
            />
            <ComboboxField
              id="sourceSite"
              label={t('Source Site')}
              items={sourceSiteDetails}
              selectedValue={sourceSiteId}
              onValueChange={setSourceSiteId}
              onSearch={fetchSourceSites}
              required
              error={error.sourceSiteId}
              disabled
            />
          </div>

          {/* Row 2: Material + Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {isFetchingMaterials ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                  <Loader2 className="animate-spin h-4 w-4 text-blue-600" />
                  {t('Loading available materials…')}
                </div>
              ) : (
                <ComboboxField
                  id="material"
                  label={t('Material')}
                  items={materialDetails}
                  selectedValue={materialId}
                  onValueChange={setMaterialId}
                  onSearch={fetchMaterials}
                  required
                  error={error.materialId}
                  disabled
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <NameField
                label={t('Quantity')}
                inputValue={quantity}
                setInputValue={setQuantity}
                placeholder={
                  maximumAllowedQuantity !== null
                    ? `${t('Max')}: ${maximumAllowedQuantity}`
                    : t('Enter Quantity')
                }
                required
                regex="^[0-9]*(\.[0-9]*)?$"
                errorMessage={error.quantity}
                isDisabled={!editable}
              />
              <QuantityLimitBadge
                quantity={quantity}
                maximumAllowedQuantity={maximumAllowedQuantity}
                visible={!!materialId}
              />
            </div>
          </div>

          {/* Target Site */}
          <ComboboxField
            id="targetSite"
            label={t('Target Site')}
            items={targetSiteDetails}
            selectedValue={targetSiteId}
            onValueChange={setTargetSiteId}
            onSearch={fetchTargetSites}
            required
            error={error.targetSiteId}
            disabled={!editable}
          />

          {/* Notes */}
          <TextareaField
            label={t('Notes')}
            inputValue={notes}
            setInputValue={setNotes}
            placeholder={t('Enter your Notes')}
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

export const MaterialShiftEditPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <MaterialShiftEditContent id={id} />;
};