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
import { CuringUrls } from '../../utils/urls';
import { formatStringToDate, nextYear } from '@/shared/utils/function';

export const CuringEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canEdit } = usePermission();
  const editable = canEdit('Curing');

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
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* ── Header ── */}
      <Header title="Edit Curing" />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* ── Site ── */}
          <ComboboxField
            id="site"
            label="Site"
            items={siteDetails}
            selectedValue={siteId}
            onValueChange={setSiteId}
            onSearch={fetchSites}
            required
            error={error.siteId}
            disabled={!editable}
          />

          {/* ── Curing Type ── */}
          <ComboboxField
            id="curingType"
            label="Curing Type"
            items={curingTypeDetails}
            selectedValue={curingTypeId}
            onValueChange={setCuringTypeId}
            onSearch={fetchCuringTypes}
            required
            error={error.curingTypeId}
            disabled={!editable}
          />

          {/* ── Start Date ── */}
          <DatePicker
            label="Start Date"
            date={startDate}
            onDateChange={date => {
              setStartDate(date);
              setEndDate('');
            }}
            required
            errorMessage={error.startDate}
            disable={!editable}
          />

          {/* ── End Date ── */}
          <DatePicker
            label="End Date"
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

          {/* ── Note ── */}
          <TextareaField
            label="Note"
            inputValue={note}
            setInputValue={setNote}
            placeholder="Enter note"
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
                fetchCuring();
                setError(initialError);
                navigate(CuringUrls.list);
              }}
            >
              Exit without Saving
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={() => {
                  handleSubmission();
                  setShowUnsavedDialog(false);
                }}
              >
                Save
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};