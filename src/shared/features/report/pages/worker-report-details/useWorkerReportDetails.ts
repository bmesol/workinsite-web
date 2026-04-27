import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkerReportService } from '../../service/WorkerReportService';
import { WorkerReportUrls } from '../../utils/urls';
import type { WorkerReportResponse } from '../../DTOs/Workerreportdetails';

interface Params {
  workerId: number;
  siteId?: string;
  fromDate: string;
  toDate: string;
}

export function useWorkerReportDetails({ workerId, siteId, fromDate, toDate }: Params) {
  const navigate               = useNavigate();
  const workerReportService    = useWorkerReportService();

  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [report, setReport]     = useState<WorkerReportResponse | null>(null);

  const fetchDetails = async () => {
    try {
      const res = await workerReportService.getAttendanceReports({
        WorkerId:         workerId,
        SiteId:           siteId ? Number(siteId) : undefined,
        FromDate:         fromDate,
        ToDate:           toDate,
        IgnorePagination: true,
      });
      setReport(res);
    } catch (e) {
      console.error('fetchDetails error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDetails(); }, [workerId, siteId, fromDate, toDate]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDetails();
  };

  const totalAmount = useMemo(() => {
    if (!report?.items) return 0;
    return report.items.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0);
  }, [report?.items]);

  const handleBack = () => navigate(WorkerReportUrls.list);

  // Navigate to attendance edit — adjust route to your project
  const handleAttendanceOpen = (attendanceId: number) =>
    navigate(`/attendance/edit/${attendanceId}`, {
      state: { redirect: `/report/worker/${workerId}`, redirectParams: { workerId, siteId, fromDate, toDate } },
    });

  // Navigate to worker edit — adjust route to your project
  const handleWorkerOpen = (wId: number) =>
    navigate(`/workers/edit/${wId}`, {
      state: { redirect: `/report/worker/${workerId}`, redirectParams: { workerId, siteId, fromDate, toDate } },
    });

  return {
    loading,
    refreshing,
    report,
    totalAmount,
    handleBack,
    handleRefresh,
    handleAttendanceOpen,
    handleWorkerOpen,
  };
}