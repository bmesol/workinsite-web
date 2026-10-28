import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { NameField } from '@/shared/components/FormFields/NameField';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
import { Header } from '@/shared/components/Header/Header';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import { QuantityLimitBadge } from '../../components/QuantityLimitBadge';
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
import { useMaterialUsedEdit } from './useMaterialUsedEdit';
import { usePermission } from '@/shared/hooks/usePermission';
import { MaterialUsedUrls } from '../../utils/urls';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const MaterialUsedEditContent = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { canEdit } = usePermission();
  const editable = canEdit('Material Used');

  const {
    siteId, setSiteId,
    materialId, setMaterialId,
    quantity, setQuantity,
    notes, setNotes,
    date, setDate,
    workModeId, setWorkModeId,
    materialUsedDetails,
    error,
    materialDetails,
    siteDetails,
    workModeDetails,
    loading,
    fetchSites,
    fetchMaterials,
    fetchWorkModes,
    handleSubmission,
    handleBack,
    maximumAllowedQuantity,
    isFetchingMaterials,
    showUnsavedDialog,
    setShowUnsavedDialog,
  } = useMaterialUsedEdit(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">{t('Loading...')}</p>
      </div>
    );
  }

  if (!materialUsedDetails) return null;

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t('Edit Material Used')} />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">
          {/* Row 1: Date + Site */}
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
              id="site"
              label={t('Site')}
              items={siteDetails}
              selectedValue={siteId ?? ''}
              onValueChange={setSiteId}
              onSearch={fetchSites}
              required
              error={error.siteId}
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
                  selectedValue={materialId ?? ''}
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

          {/* Work Mode */}
          <ComboboxField
            id="workMode"
            label={t('Work Mode')}
            items={workModeDetails}
            selectedValue={workModeId ?? ''}
            onValueChange={setWorkModeId}
            onSearch={fetchWorkModes}
            required
            error={error.workModeId}
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
            onSave={editable ? handleSubmission : () => {}}
            onCancel={handleBack}
          />
        </div>
      </Card>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Unsaved Changes')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('You have unsaved changes. Do you want to save them before leaving?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => navigate(MaterialUsedUrls.list)}>
              {t('Exit Without Saving')}
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={() => {
                  setShowUnsavedDialog(false);
                  handleSubmission();
                }}
              >
                {t('Save')}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const MaterialUsedEditPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <MaterialUsedEditContent id={id} />;
};