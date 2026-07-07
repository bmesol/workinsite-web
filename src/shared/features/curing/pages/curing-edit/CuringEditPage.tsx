import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Header } from '@/shared/components/Header/Header';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
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
import { useCuringEdit } from './useCuringEdit';
import { usePermission } from '@/shared/hooks/usePermission';
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { CuringUrls } from '../../utils/urls';
import { formatStringToDate, nextYear } from '@/shared/utils/function';

export const CuringEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canEdit } = usePermission();
  const editable = canEdit('Curing');
  const { t } = useLanguage();

  if (!id) return null;

  const {
    siteId, setSiteId,
    curingTypeId, setCuringTypeId,
    startDate, setStartDate,
    endDate, setEndDate,
    note, setNote,
    siteDetails,
    curingTypeDetails,
    fetchSites,
    fetchCuringTypes,
    error,
    loading,
    handleSubmission,
    handleBack,
    showUnsavedDialog,
    setShowUnsavedDialog,
    fetchCuring,
    setError,
    initialError,
  } = useCuringEdit(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">{t('Loading...')}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      <Header title={t('Edit Curing')} />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          <ComboboxField
            id="site"
            label={t('Site')}
            items={siteDetails}
            selectedValue={siteId}
            onValueChange={setSiteId}
            onSearch={fetchSites}
            required
            error={error.siteId}
            disabled={!editable}
          />

          <ComboboxField
            id="curingType"
            label={t('Curing Type')}
            items={curingTypeDetails}
            selectedValue={curingTypeId}
            onValueChange={setCuringTypeId}
            onSearch={fetchCuringTypes}
            required
            error={error.curingTypeId}
            disabled={!editable}
          />

          <DatePicker
            label={t('Start Date')}
            date={startDate}
            onDateChange={date => {
              setStartDate(date);
              setEndDate('');
            }}
            required
            errorMessage={error.startDate}
            disable={!editable}
          />

          <DatePicker
            label={t('End Date')}
            date={endDate}
            onDateChange={setEndDate}
            required
            errorMessage={error.endDate}
            disable={!editable || !startDate}
            minDate={
              startDate
                ? formatStringToDate(startDate) ?? new Date(2020, 0, 1)
                : new Date(2020, 0, 1)
            }
            maxDate={nextYear}
          />

          <TextareaField
            label={t('Note')}
            inputValue={note}
            setInputValue={setNote}
            placeholder={t('Enter note')}
            isDisabled={!editable}
          />

          <FormSubmissionButtons
            onSave={handleSubmission}
            onCancel={handleBack}
            disabled={!editable}
          />

        </div>
      </Card>

      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Unsaved Changes')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('You have unsaved changes. Do you want to save them before leaving?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                fetchCuring();
                setError(initialError);
                navigate(CuringUrls.list);
              }}
            >
              {t('Exit without Saving')}
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={() => {
                  handleSubmission();
                  setShowUnsavedDialog(false);
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
