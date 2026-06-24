import { useCallback, useEffect, useRef, useState } from 'react';
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

  const [checkIn, setCheckIn] = useState<SupervisorAttendance | null>(null);
  const [mySite, setMySite] = useState<Site | null>(null);
  const [todayWorkers, setTodayWorkers] = useState<AttendanceItem[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [weekHistory, setWeekHistory] = useState<SupervisorAttendance[]>([]);
  const [stats, setStats] = useState<SupervisorStats>({ present: 0, myTaskCount: 0 });
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const fetchAll = useCallback(async () => {
    if (!userProfile?.id) return;

    try {
      const [checkInRes, sitesRes, tasksRes, weekRes] = await Promise.allSettled([
        supervisorService.getSupervisorAttendances({
          SupervisorId: Number(userProfile.id),
          FromDate: today,
          ToDate: today,
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

      // Today check in
      const todayCheckIn =
        checkInRes.status === 'fulfilled'
          ? (checkInRes.value?.items?.[0] ?? null)
          : null;
      setCheckIn(todayCheckIn);

      // Assigned site
      const allSites =
        sitesRes.status === 'fulfilled' && Array.isArray(sitesRes.value)
          ? sitesRes.value
          : [];
      const assignedSite =
        allSites.find((s: Site) =>
          s.supervisors?.some((sup) => sup.id === Number(userProfile.id)),
        ) ?? null;
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

  const handleCheckIn = useCallback(async () => {
    if (!userProfile?.id) return;
    setCheckingIn(true);
    try {
      const location = await getLocation();
      await supervisorService.createSupervisorAttendance({
        date: today,
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
      } else {
        toast.error('Check-in failed. Please try again.');
      }
    } finally {
      if (isMounted.current) setCheckingIn(false);
    }
  }, [userProfile?.id, today, getLocation, fetchAll, supervisorService]);

  const handleCheckOut = useCallback(async () => {
    if (!checkIn) return;
    try {
      await supervisorService.deleteSupervisorAttendance(checkIn.id);
      if (isMounted.current) {
        setCheckIn(null);
        setTodayWorkers([]);
        setStats((prev) => ({ ...prev, present: 0 }));
        toast.success('Checked out successfully.');
      }
    } catch {
      toast.error('Check-out failed. Please try again.');
    }
  }, [checkIn, supervisorService]);

  return {
    userProfile,
    checkIn,
    mySite,
    todayWorkers,
    myTasks,
    weekHistory,
    stats,
    today,
    loading,
    checkingIn,
    refreshing,
    handleCheckIn,
    handleCheckOut,
    handleRefresh,
  };
};

export { useSupervisorDashboard };
