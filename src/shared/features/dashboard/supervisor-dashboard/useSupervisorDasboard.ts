import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AuthHelper } from '@/shared/features/auth/helpers/AuthHelper';
import { useSupervisorAttendanceService } from '@/shared/features/report/service/SupervisorAttendanceService';
import { useAttendanceService } from '@/shared/features/attendance/service/AttendanceService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useTaskService } from '@/shared/features/task/service/TaskService';
import { useCurrentLocation } from '@/shared/hooks/useCurrentLocation';

// Types
export type Site = {
  id: number;
  name: string;
  status: string;
  supervisors?: { id: number }[];
};

export type AttendanceItem = {
  id: number;
  date: string;
  worker?: { name: string };
  workType?: { name: string };
  wageType?: { name: string };
};

export type Task = {
  id: number;
  taskName: string;
  priority: string;
  status: string;
  site?: { name: string };
  supervisor?: { id: number };
};

export type SupervisorAttendance = {
  id: number;
  date: string;
  time?: string;
  site?: { id: number; name: string };
  currentLocation?: { address: string };
};

export type SupervisorStats = {
  present: number;
  myTaskCount: number;
};

// Format date as DD-MM-YYYY for API
const formatToApiDate = (date: Date): string => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

// Format time as HH:MM:SS for API (mobile parity)
const formatToApiTime = (date: Date): string => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mi}:${ss}`;
};

// Get week start (Monday)
const getWeekStart = (): string => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return formatToApiDate(new Date(now.setDate(diff)));
};

const useSupervisorDashboard = () => {
  const userProfile = AuthHelper.getUserProfile();

  const supervisorService = useSupervisorAttendanceService();
  const attendanceService = useAttendanceService();
  const siteService = useSiteService();
  const taskService = useTaskService();
  const { getLocation } = useCurrentLocation();

  const today = useRef(formatToApiDate(new Date())).current;
  const weekStart = useRef(getWeekStart()).current;
  const isMounted = useRef(true);

  // Today's check-ins is now a LIST — one record per site (mobile parity)
  const [todayCheckIns, setTodayCheckIns] = useState<SupervisorAttendance[]>([]);
  const [mySites, setMySites] = useState<Site[]>([]);
  const [mySite, setMySite] = useState<Site | null>(null);
  const [todayWorkers, setTodayWorkers] = useState<AttendanceItem[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [weekHistory, setWeekHistory] = useState<SupervisorAttendance[]>([]);
  const [stats, setStats] = useState<SupervisorStats>({ present: 0, myTaskCount: 0 });
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSitePicker, setShowSitePicker] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Sites not yet checked in today — shown in the picker dialog (mobile parity)
  const availableSites = useMemo(() => {
    const checkedInIds = new Set(
      todayCheckIns
        .map((c) => c.site?.id)
        .filter((id): id is number => id !== undefined),
    );
    return mySites.filter((s) => s.status === 'Working' && !checkedInIds.has(s.id));
  }, [mySites, todayCheckIns]);

  const fetchAll = useCallback(async () => {
    if (!userProfile?.id) return;

    try {
      const [checkInRes, sitesRes, tasksRes, weekRes] = await Promise.allSettled([
        supervisorService.getSupervisorAttendances({
          SupervisorId: Number(userProfile.id),
          FromDate: today,
          ToDate: today,
          IgnorePagination: true,
        }),
        siteService.getSites(),
        taskService.getTasks(),
        supervisorService.getSupervisorAttendances({
          SupervisorId: Number(userProfile.id),
          FromDate: weekStart,
          ToDate: today,
          IgnorePagination: true,
        }),
      ]);

      if (!isMounted.current) return;

      // All of today's check-ins (can be multiple — one per site)
      const checkInsToday =
        checkInRes.status === 'fulfilled'
          ? (checkInRes.value?.items ?? [])
          : [];
      setTodayCheckIns(checkInsToday);

      // ALL sites assigned to this supervisor (mobile parity — was find() before)
      const allSites =
        sitesRes.status === 'fulfilled' && Array.isArray(sitesRes.value)
          ? sitesRes.value
          : [];
      const supervisorSites = allSites.filter((s: Site) =>
        s.supervisors?.some((sup) => sup.id === Number(userProfile.id)),
      );
      setMySites(supervisorSites);
      const assignedSite = supervisorSites[0] ?? null;
      setMySite(assignedSite);

      // My open tasks
      const allTasks =
        tasksRes.status === 'fulfilled' && Array.isArray(tasksRes.value)
          ? tasksRes.value
          : [];
      const supervisorTasks = allTasks.filter(
        (t: Task) =>
          t.supervisor?.id === Number(userProfile.id) && t.status === 'Open',
      );
      setMyTasks(supervisorTasks);

      // Week history
      const history =
        weekRes.status === 'fulfilled' ? (weekRes.value?.items ?? []) : [];
      setWeekHistory(history);

      // Workers for assigned site
      if (assignedSite) {
        const workersRes = await attendanceService.getAttendances({
          date: today,
          siteId: assignedSite.id,
          pageSize: 30,
        });
        if (isMounted.current) {
          const workers = Array.isArray(workersRes?.items) ? workersRes.items : [];
          setTodayWorkers(workers);
          setStats({ present: workers.length, myTaskCount: supervisorTasks.length });
        }
      } else {
        setTodayWorkers([]);
        setStats({ present: 0, myTaskCount: supervisorTasks.length });
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [userProfile?.id, today, weekStart]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAll();
    if (isMounted.current) setRefreshing(false);
  }, [fetchAll]);

  // Opens the site picker dialog — actual submission happens in handleSiteSelected
  const handleCheckIn = useCallback(() => {
    setShowSitePicker(true);
  }, []);

  const closeSitePicker = useCallback(() => {
    setShowSitePicker(false);
  }, []);

  // Called when supervisor picks a site from the dialog (mobile parity)
  const handleSiteSelected = useCallback(
    async (site: Site) => {
      if (!userProfile?.id) return;
      setShowSitePicker(false);
      setCheckingIn(true);
      try {
        const location = await getLocation();
        const checkInTime = formatToApiTime(new Date());
        await supervisorService.createSupervisorAttendance({
          date: today,
          time: checkInTime,
          siteId: site.id,
          supervisorId: Number(userProfile.id),
          currentLocation: {
            lat: location.lat,
            lng: location.lng,
            address: location.address,
          },
        });
        toast.success('Checked in successfully ✓');
        await fetchAll();
      } catch (err: any) {
        if (err?.message === 'LOCATION_PERMISSION_DENIED') {
          toast.error('Location permission denied. Please allow location access.');
        } else if (err?.message === 'GEOLOCATION_NOT_SUPPORTED') {
          toast.error('Your browser does not support location.');
        } else if (err?.response?.data?.[0]?.message) {
          toast.error(err.response.data[0].message);
        } else {
          toast.error('Check-in failed. Please try again.');
        }
      } finally {
        if (isMounted.current) setCheckingIn(false);
      }
    },
    [userProfile?.id, today, getLocation, fetchAll, supervisorService],
  );

  // Deletes a specific check-in record (mobile parity — per record, not global)
  const handleCheckOut = useCallback(
    async (record: SupervisorAttendance) => {
      try {
        await supervisorService.deleteSupervisorAttendance(record.id);
        if (isMounted.current) {
          setTodayCheckIns((prev) => prev.filter((c) => c.id !== record.id));
          toast.success('Checked out successfully.');
        }
      } catch {
        toast.error('Check-out failed. Please try again.');
      }
    },
    [supervisorService],
  );

  return {
    userProfile,
    todayCheckIns,
    mySites,
    mySite,
    availableSites,
    showSitePicker,
    todayWorkers,
    myTasks,
    weekHistory,
    stats,
    today,
    loading,
    checkingIn,
    refreshing,
    handleCheckIn,
    closeSitePicker,
    handleSiteSelected,
    handleCheckOut,
    handleRefresh,
  };
};

export { useSupervisorDashboard };