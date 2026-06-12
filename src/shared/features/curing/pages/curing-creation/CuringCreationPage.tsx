import { Card } from '@/shared/components/ui/card';
import { Header } from '@/shared/components/Header/Header';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import { useCuringCreate } from './useCuringCreation';
import { usePermission } from '@/shared/hooks/usePermission';
import { formatStringToDate, nextYear } from '@/shared/utils/function';

export const CuringCreationPage = () => {
  const { canEdit } = usePermission();
  const editable = canEdit('Curing');

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
    handleSubmission,
    handleBack,
  } = useCuringCreate();

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* ── Header ── */}
      <Header title="New Curing" />

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

          {/* ── Create / Cancel ── */}
          <FormSubmissionButtons
            label="Create"
            onSave={handleSubmission}
            onCancel={handleBack}
            disabled={!editable}
          />

        </div>
      </Card>

    </div>
  );
};