import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { AuthHelper } from '@/shared/features/auth/helpers/AuthHelper';
import { useSupervisorAttendanceService } from '@/shared/features/report/service/SupervisorAttendanceService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useCurrentLocation } from '@/shared/hooks/useCurrentLocation';
import { ROLE_IDS } from '@/shared/features/rolesandrights/DTOs/DTOs';

export type SidebarSite = {
  id: number;
  name: string;
  status: string;
  supervisors?: { id: number }[];
};

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
  const siteService = useSiteService();
  const { getLocation } = useCurrentLocation();

  const [checkedIn, setCheckedIn] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mySites, setMySites] = useState<SidebarSite[]>([]);
  const [showSitePicker, setShowSitePicker] = useState(false);

  const apiDate = useRef(getTodayApiDate()).current;

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

  const fetchMySites = useCallback(async () => {
    if (!userProfile?.id || !isSupervisor) return;

    try {
      const allSites: SidebarSite[] = await siteService.getSites();
      const assigned = allSites.filter((s) =>
        s.supervisors?.some((sup) => sup.id === Number(userProfile.id)),
      );
      setMySites(assigned);
    } catch {
      // silent fail
    }
  }, [userProfile?.id, isSupervisor, siteService]);

  useEffect(() => {
    if (isOpen && isSupervisor) {
      checkTodayAttendance();
      fetchMySites();
    }
  }, [isOpen, isSupervisor, checkTodayAttendance, fetchMySites]);

  const doCheckIn = useCallback(
    async (site: SidebarSite) => {
      if (!userProfile?.id) return;
      setLoading(true);

      try {
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

        const location = await getLocation();

        await attendanceService.createSupervisorAttendance({
          supervisorId: Number(userProfile.id),
          siteId: site.id,
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
    },
    [userProfile?.id, apiDate, attendanceService, getLocation],
  );

  const handleCheckIn = useCallback(() => {
    if (checkedIn || !isSupervisor || !userProfile?.id) return;

    if (mySites.length === 1) {
      doCheckIn(mySites[0]);
    } else {
      setShowSitePicker(true);
    }
  }, [checkedIn, isSupervisor, userProfile?.id, mySites, doCheckIn]);

  const handleSiteSelected = useCallback(
    (site: SidebarSite) => {
      setShowSitePicker(false);
      doCheckIn(site);
    },
    [doCheckIn],
  );

  const closeSitePicker = useCallback(() => {
    setShowSitePicker(false);
  }, []);

  return {
    isSupervisor,
    checkedIn,
    address,
    loading,
    mySites,
    showSitePicker,
    handleCheckIn,
    handleSiteSelected,
    closeSitePicker,
  };
};
