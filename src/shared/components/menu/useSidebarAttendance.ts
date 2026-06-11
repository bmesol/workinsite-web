import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { AuthHelper } from '@/shared/features/auth/helpers/AuthHelper';
import { useSupervisorAttendanceService } from '@/shared/features/report/service/SupervisorAttendanceService';
import { useCurrentLocation } from '@/shared/hooks/useCurrentLocation';
import { ROLE_IDS } from '@/shared/features/rolesandrights/DTOs/DTOs';

// Format today as DD-MM-YYYY for API
const getTodayApiDate = (): string => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export const useSidebarAttendance = (isOpen: boolean) => {
  const userProfile = AuthHelper.getUserProfile();
  const isSupervisor = userProfile?.role?.id === ROLE_IDS.SUPERVISOR;

  const attendanceService = useSupervisorAttendanceService();
  const { getLocation } = useCurrentLocation();

  const [checkedIn, setCheckedIn] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apiDate = useRef(getTodayApiDate()).current;

  // Check if supervisor already checked in today
  const checkTodayAttendance = useCallback(async () => {
    if (!userProfile?.id || !isSupervisor) return;

    try {
      const response = await attendanceService.getSupervisorAttendances({
        SupervisorId: Number(userProfile.id),
        FromDate: apiDate,
        IgnorePagination: true,
      });

      const alreadyCheckedIn = (response?.items?.length ?? 0) > 0;
      setCheckedIn(alreadyCheckedIn);
      setAddress(response?.items?.[0]?.currentLocation?.address ?? null);
    } catch {
      // silent fail
    }
  }, [userProfile?.id, isSupervisor, apiDate, attendanceService]);

  // Run check when sidebar opens
  useEffect(() => {
    if (isOpen && isSupervisor) {
      checkTodayAttendance();
    }
  }, [isOpen, isSupervisor, checkTodayAttendance]);

  const handleCheckIn = useCallback(async () => {
    if (checkedIn || !isSupervisor || !userProfile?.id) return;

    setLoading(true);

    try {
      // Double check — already checked in?
      const existing = await attendanceService.getSupervisorAttendances({
        SupervisorId: Number(userProfile.id),
        FromDate: apiDate,
        IgnorePagination: true,
      });

      if ((existing?.items?.length ?? 0) > 0) {
        setCheckedIn(true);
        setAddress(existing?.items?.[0]?.currentLocation?.address ?? null);
        toast.info('Already checked in today.');
        return;
      }

      // Get GPS location
      const location = await getLocation();

      // Create attendance
      await attendanceService.createSupervisorAttendance({
        supervisorId: Number(userProfile.id),
        date: apiDate,
        currentLocation: location,
      });

      setCheckedIn(true);
      setAddress(location.address);
      toast.success('Attendance marked successfully ✓');
    } catch (err: any) {
      if (err?.message === 'LOCATION_PERMISSION_DENIED') {
        toast.error('Location permission denied. Please allow location access.');
      } else if (err?.message === 'GEOLOCATION_NOT_SUPPORTED') {
        toast.error('Your browser does not support location access.');
      } else if (err?.response?.data?.[0]?.message) {
        toast.error(err.response.data[0].message);
      } else {
        toast.error('Failed to mark attendance.');
      }
    } finally {
      setLoading(false);
    }
  }, [
    checkedIn,
    isSupervisor,
    userProfile?.id,
    apiDate,
    attendanceService,
    getLocation,
  ]);

  return {
    isSupervisor,
    checkedIn,
    address,
    loading,
    handleCheckIn,
  };
};