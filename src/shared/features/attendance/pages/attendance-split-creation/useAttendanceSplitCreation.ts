import { useState } from 'react';
import { useAttendanceSplitInputValidate } from '../../components/InputValidate/AttendanceSplitInputValidate';
import { useWorkerRoleService } from '@/shared/features/workers/service/WorkerRoleService';
import { useShiftService } from '@/shared/features/workers/service/ShiftService';
import type { AttendanceSplit } from '../../DTOs/AttendanceProps';
import type { Shift } from '@/shared/features/workers/DTOs/ShiftProps';

interface AttendanceSplitProps {
  attendanceSplit: AttendanceSplit[];
  setAttendanceSplit: (value: AttendanceSplit[]) => void;
  onClose?: () => void;        
  workerCategoryId: number;
}

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

const defaultWorkerRole: WorkerRole = {
  id: 0,
  name: '',
  salaryPerShift: '',
  hoursPerShift: '',
  workerCategory: { id: 0, name: '', note: '' },
};

const defaultShift: Shift = {
  id: 0,
  name: '',
  multiplier: '',
};

export const useAttendanceSplitCreationScreen = (props: AttendanceSplitProps) => {
  const { attendanceSplit, setAttendanceSplit, onClose } = props;

  const [workerRoleId, setWorkerRoleId] = useState<WorkerRole>(defaultWorkerRole);
  const [shiftId, setShiftId] = useState<Shift>(defaultShift);
  const [noOfPersons, setNoOfPersons] = useState('');
  const [workerRoleList, setWorkerRoleList] = useState<WorkerRole[]>([]);
  const [shiftList, setShiftList] = useState<Shift[]>([]);

  const workerRoleService = useWorkerRoleService();
  const shiftService = useShiftService();

  const { error, validate, setError, initialError } =
    useAttendanceSplitInputValidate({
      workerRoleId: workerRoleId?.id?.toString(),
      shiftId: shiftId?.id?.toString(),
      noOfPersons,
    });

  // Dropdown option mappers
  const workerRoleDetails = workerRoleList.map(item => ({
    label: `${item.name} [${item.workerCategory.name}]`,
    value: item.id.toString(),
    allItems: {
      value: item.id.toString(),
      id: item.id,
      name: item.name,
      salaryPerShift: item.salaryPerShift,
      hoursPerShift: item.hoursPerShift,
      workerCategory: {
        id: item.workerCategory.id,
        name: item.workerCategory.name,
        note: item.workerCategory.note,
      },
    },
  }));

  const shiftDetails = shiftList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: {
      value: item.id.toString(),
      id: item.id,
      name: item.name,
      multiplier: item.multiplier,
    },
  }));

  // Fetch functions
  const fetchWorkerRoles = async (WorkerRoleName: string = '') => {
    const workerRoles = await workerRoleService.getWorkerRoles({
      WorkerRoleName,
      WorkerCategoryId: props.workerCategoryId,
    });
    if (!workerRoles) return;
    setWorkerRoleList(WorkerRoleName ? workerRoles.slice(0, 3) : workerRoles);
  };

  const fetchShifts = async (searchString: string = '') => {
    const shifts = await shiftService.getShifts(searchString);
    if (!shifts) return;
    setShiftList(searchString ? shifts.slice(0, 3) : shifts);
  };

  const resetFormFields = () => {
    setWorkerRoleId(defaultWorkerRole);
    setShiftId(defaultShift);
    setShiftList([]);
    setWorkerRoleList([]);
    setNoOfPersons('');
    setError(initialError);
  };

  const handleSubmit = () => {
    if (validate()) {
      const isRoleAndShiftExists = attendanceSplit.some(
        entry =>
          entry.workerRole.id.toString() === workerRoleId.id.toString() &&
          entry.shift.id.toString() === shiftId.id.toString(),
      );

      if (isRoleAndShiftExists) {
        setError(prev => ({
          ...prev,
          workerRoleId: 'This worker role with selected shift is already added',
        }));
        return;
      }

      const newEntry: AttendanceSplit = {
        workerRole: workerRoleId,
        shift: shiftId,
        noOfPersons,
      };

      setAttendanceSplit([...attendanceSplit, newEntry]);
      resetFormFields();
      onClose?.();             // ✅ replaces Ref?.current?.close()
    }
  };

  return {
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
  };
};