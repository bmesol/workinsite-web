import {useState} from 'react';
import {useAttendanceSplitInputValidate} from '../../components/InputValidate/AttendanceSpilitInputValidate';
import {useWorkerRoleService} from '@/shared/features/workers/service/WorkerRoleService';
import type {AttendanceSplit} from '../../DTOs/AttendanceProps';
import type {Shift} from '@/shared/features/workers/DTOs/ShiftProps';
import {useShiftService} from '@/shared/features/workers/service/ShiftService';

interface AttendanceSplitProps {
  attendanceSplit: AttendanceSplit[];
  setAttendanceSplit: (value: AttendanceSplit[]) => void;
  Ref?: any;
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

const defaultWorkerRole = {
  id: 0,
  name: '',
  salaryPerShift: '',
  hoursPerShift: '',
  workerCategory: {
    id: 0,
    name: '',
    note: '',
  },
};

const defaultShift = {
  id: 0,
  name: '',
  multiplier: '',
};

export const useAttendanceSplitCreationScreen = (
  props: AttendanceSplitProps,
) => {
  const {attendanceSplit, setAttendanceSplit, Ref} = props;
  const [workerRoleId, setWorkerRoleId] =
    useState<WorkerRole>(defaultWorkerRole);
  const [shiftId, setShiftId] = useState<Shift>(defaultShift);
  const [noOfPersons, setNoOfPersons] = useState('');
  const [workerRoleList, setWorkerRoleList] = useState<WorkerRole[]>([]);
  const [shiftList, setShiftList] = useState<Shift[]>([]);

  const workerRoleService = useWorkerRoleService();
  const shiftService = useShiftService();

  const {error, validate, setError, initialError} =
    useAttendanceSplitInputValidate({
      workerRoleId: workerRoleId?.id?.toString(),
      shiftId: shiftId?.id?.toString(),
      noOfPersons,
    });

  const workerRoleDetails = workerRoleList.map(item => ({
    label: `${item.name} [${item.workerCategory.name}]`,
    value: item.id.toString(),
    allItems: {
      value: item.id.toString(),
      id: item.id,
      name: item.name,
      workerCategory: {
        id: item.workerCategory.id,
        name: item.workerCategory.name,
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
    },
  }));

  const fetchWorkerRoles = async (WorkerRoleName: string = '') => {
  const workerRoles = await workerRoleService.getWorkerRoles({
    WorkerRoleName,
    WorkerCategoryId: props.workerCategoryId,
  });
  if (!workerRoles) return;
  setWorkerRoleList(
    WorkerRoleName ? workerRoles.slice(0, 3) : workerRoles
  );
};

  const fetchShifts = async (searchString: string = '') => {
  const shifts = await shiftService.getShifts(searchString);
  if (!shifts) return;
  setShiftList(
    searchString ? shifts.slice(0, 3) : shifts
  );
};


  const resetFormFields = () => {
    setWorkerRoleId(defaultWorkerRole);
    setShiftId(defaultShift);
    setShiftList([]);
    setWorkerRoleList([]);
    setNoOfPersons('');
    setError(initialError);
  };

  const handleSubmit = async () => {
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

      const newAttendanceSplitEntry = {
        workerRole: workerRoleId,
        shift: shiftId,
        noOfPersons: noOfPersons,
      };
      setAttendanceSplit([...attendanceSplit, newAttendanceSplitEntry]);
      resetFormFields();
      Ref?.current?.close();
    }
  };

  return {
    workerRoleDetails,
    error,
    workerRoleId,
    noOfPersons,
    shiftId,
    shiftDetails,
    setShiftId,
    fetchShifts,
    setNoOfPersons,
    setWorkerRoleId,
    fetchWorkerRoles,
    handleSubmit,
  };
};