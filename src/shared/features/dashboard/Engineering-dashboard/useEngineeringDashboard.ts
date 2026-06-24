import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useTaskService } from '@/shared/features/task/service/TaskService';
import { useWorkerReportService } from '@/shared/features/report/service/WorkerReportService';
import { useMaterialPurchaseService } from '@/shared/features/materials/service/PurchaseService';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { Task } from '@/shared/features/task/DTOs/TaskProps';
import { formatDateToString, getWeekRange } from '@/shared/utils/function';
import { AttendanceUrls, TaskUrls, SiteUrls, PurchaseUrls } from '../utils/urls';

export type EngineerStats = {
  activeSiteCount: number;
  workersToday: number;
  wagesToday: number;
  wagesWeek: number;
  openTaskCount: number;
};

export type RecentPurchase = {
  id: number;
  billNumber: string;
  supplier?: { name: string };
  site?: { name: string };
  totalAmount: number | string;
  date: string;
};

export type ChartDataItem = {
  value: number;
  color: string;
  text: string;
};

const SITE_STATUS_COLORS: Record<string, string> = {
  Working: '#1D9E75',
  Completed: '#185FA5',
  'Yet to start': '#BA7517',
  Hold: '#A32D2D',
};

const useEngineerDashboard = () => {
  const navigate = useNavigate();

  const siteService = useSiteService();
  const taskService = useTaskService();
  const reportService = useWorkerReportService();
  const purchaseService = useMaterialPurchaseService();

  const today = formatDateToString(new Date());
  const { from: weekStart } = getWeekRange('currentWeek');

  const [sites, setSites] = useState<Site[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [stats, setStats] = useState<EngineerStats>({
    activeSiteCount: 0,
    workersToday: 0,
    wagesToday: 0,
    wagesWeek: 0,
    openTaskCount: 0,
  });
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [openTasks, setOpenTasks] = useState<Task[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setError(null);
    try {
      const [sitesRes, todayRes, weekRes, tasksRes, purchasesRes] =
        await Promise.allSettled([
          siteService.getSites(),
          reportService.getAttendanceReportSummary({
            FromDate: today,
            ToDate: today,
            IgnorePagination: true,
          }),
          reportService.getAttendanceReportSummary({
            FromDate: weekStart,
            ToDate: today,
            IgnorePagination: true,
          }),
          taskService.getTasks(),
          purchaseService.getMaterialPurchases({ pageSize: 3 }),
        ]);

      // Sites
      const allSites: Site[] =
        sitesRes.status === 'fulfilled' && Array.isArray(sitesRes.value)
          ? sitesRes.value
          : [];
      setSites(allSites);

      // Chart
      const counts: Record<string, number> = {
        Working: 0,
        Completed: 0,
        'Yet to start': 0,
        Hold: 0,
      };
      allSites.forEach((s) => {
        if (s.status in counts) counts[s.status]++;
      });
      setChartData(
        Object.entries(counts)
          .filter(([, value]) => value > 0)
          .map(([text, value]) => ({
            value,
            color: SITE_STATUS_COLORS[text] ?? '#888',
            text,
          }))
      );

      // Tasks
      const allTasks: Task[] =
        tasksRes.status === 'fulfilled' && Array.isArray(tasksRes.value)
          ? tasksRes.value
          : [];
      const openAll = allTasks.filter((t) => t.status === 'Open');
      setUrgentTasks(openAll.filter((t) => t.priority === 'Urgent'));
      setOpenTasks(openAll.filter((t) => t.priority !== 'Urgent'));

      // Stats
      const todayReport =
        todayRes.status === 'fulfilled' ? todayRes.value : null;
      const weekReport =
        weekRes.status === 'fulfilled' ? weekRes.value : null;
      setStats({
        activeSiteCount: allSites.filter((s) => s.status === 'Working').length,
        workersToday: todayReport?.items?.length ?? 0,
        wagesToday: todayReport?.totalAmount ?? 0,
        wagesWeek: weekReport?.totalAmount ?? 0,
        openTaskCount: openAll.length,
      });

      // Purchases
      const rawPurchases =
        purchasesRes.status === 'fulfilled'
          ? (purchasesRes.value?.items ?? [])
          : [];
      setRecentPurchases(rawPurchases.slice(0, 3));
    } catch (err) {
      console.error('EngineerDashboard: fetchAll failed', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [today, weekStart]);

  useEffect(() => {
    setLoading(true);
    fetchAll();
  }, [fetchAll]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  }, [fetchAll]);

  const retryFetch = useCallback(() => {
    setLoading(true);
    fetchAll();
  }, [fetchAll]);

  // Navigation
  const navigateAttendance = () => navigate(AttendanceUrls.create);
  const navigateNewTask = () => navigate(TaskUrls.create);
  const navigateToSites = (statusFilter?: string) =>
    navigate(SiteUrls.list, statusFilter ? { state: { statusFilter } } : undefined);
  const navigateToAttendanceList = () => navigate(AttendanceUrls.list);
  const navigateToTaskList = () => navigate(TaskUrls.list);
  const navigateToTask = (id: number) => navigate(TaskUrls.edit(id));
  const navigateToPurchaseList = () => navigate(PurchaseUrls.list);
  const navigateToPurchase = (id: number) => navigate(PurchaseUrls.edit(id));

  return {
    sites,
    chartData,
    stats,
    urgentTasks,
    openTasks,
    recentPurchases,
    loading,
    refreshing,
    error,
    handleRefresh,
    retryFetch,
    navigateAttendance,
    navigateNewTask,
    navigateToSites,
    navigateToAttendanceList,
    navigateToTaskList,
    navigateToTask,
    navigateToPurchaseList,
    navigateToPurchase,
  };
};

export { useEngineerDashboard };