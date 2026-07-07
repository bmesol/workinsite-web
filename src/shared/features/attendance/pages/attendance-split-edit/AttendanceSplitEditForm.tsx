import useAttendanceSplitEditForm from './useAttendanceSplitEditForm';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { NameField } from '@/shared/components/FormFields/NameField';
import { Button } from '@/shared/components/ui/button';
import type { Shift } from '@/shared/features/workers/DTOs/ShiftProps';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

export type WorkerCategory = {
  id: number;
  name: string;
  note: string;
};

export type WorkerRole = {
  id: number;
  name: string;
  salaryPerShift: string;
  hoursPerShift: string;
  workerCategory: WorkerCategory;
};

interface AttendanceSplit {
  workerRole: WorkerRole;
  shift: Shift;
  noOfPersons: string;
}

interface AttendanceSplitEditFormProps {
  attendanceSplit: AttendanceSplit[];
  setAttendanceSplit: (attendanceSplit: AttendanceSplit[]) => void;
  selectedAttendance: AttendanceSplit;
  closeModal: () => void;
  workerCategoryId: number;
}

const AttendanceSplitEditForm = (props: AttendanceSplitEditFormProps) => {
  const { t } = useLanguage();
  const {
    workerRoleDetails,
    shiftDetails,
    workerRoleId,
    shiftId,
    noOfPersons,
    error,
    setWorkerRoleId,
    setShiftId,
    setNoOfPersons,
    fetchWorkerRoles,
    fetchShifts,
    handleSubmit,
  } = useAttendanceSplitEditForm(props);

  return (
    <div className="flex flex-col gap-4 pt-2">

      {/* Worker Role — disabled (edit mode) */}
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
        disabled={true}
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
      />

      {/* No Of Persons */}
      <NameField
        label={t('No Of Persons')}
        inputValue={noOfPersons}
        setInputValue={setNoOfPersons}
        placeholder={t('Enter No Of Persons')}
        errorMessage={error.noOfPersons}
        required
      />

      {/* Update Button */}
      <div className="flex justify-end">
        <Button type="button" className="w-24" onClick={handleSubmit}>
          {t('Update')}
        </Button>
      </div>

    </div>
  );
};

export default AttendanceSplitEditForm;
