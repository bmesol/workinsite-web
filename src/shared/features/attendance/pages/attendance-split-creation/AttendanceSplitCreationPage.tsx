import { useAttendanceSplitCreationScreen } from './useAttendanceSplitCreation';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { NameField } from '@/shared/components/FormFields/NameField';
import { Button } from '@/shared/components/ui/button';
import type { AttendanceSplit } from '../../DTOs/AttendanceProps';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

interface AttendanceSplitProps {
  attendanceSplit: AttendanceSplit[];
  setAttendanceSplit: (value: AttendanceSplit[]) => void;
  onClose?: () => void;
  workerCategoryId: number;
}

export const AttendanceSplitCreationPage = (props: AttendanceSplitProps) => {
  const { t } = useLanguage();
  const {
    workerRoleDetails,
    shiftDetails,
    error,
    workerRoleId,
    shiftId,
    noOfPersons,
    setWorkerRoleId,
    setShiftId,
    setNoOfPersons,
    fetchWorkerRoles,
    fetchShifts,
    handleSubmit,
  } = useAttendanceSplitCreationScreen(props);

  return (
    <div className="flex flex-col gap-4 pt-2">

      {/* Worker Role */}
      <ComboboxField
        id="workerRole"
        label={t('Worker Role')}
        items={workerRoleDetails}
        selectedValue={workerRoleId.id.toString()}
        onValueChange={(val) => {
          const found = workerRoleDetails.find(i => i.value === val);
          if (found?.allItems) setWorkerRoleId(found.allItems as any);
        }}
        onSearch={fetchWorkerRoles}
        error={error.workerRoleId}
        disabled={!props.workerCategoryId}
        required
      />

      {/* Shift */}
      <ComboboxField
        id="shift"
        label={t('Shift')}
        items={shiftDetails}
        selectedValue={shiftId.id.toString()}
        onValueChange={(val) => {
          const found = shiftDetails.find(i => i.value === val);
          if (found?.allItems) setShiftId(found.allItems as any);
        }}
        onSearch={fetchShifts}
        error={error.shiftId}
        required
        className="bg-transparent"
      />

      {/* No Of Persons */}
      <NameField
        label={t('No Of Persons')}
        inputValue={noOfPersons}
        setInputValue={setNoOfPersons}
        placeholder={t('Enter No Of Persons')}
        errorMessage={error.noOfPersons}
        required
        regex="^[0-9.]*$"
      />

      {/* Add Button */}
      <div className="flex justify-end">
        <Button type="button" className="w-24" onClick={handleSubmit}>
          {t('Add')}
        </Button>
      </div>

    </div>
  );
};
