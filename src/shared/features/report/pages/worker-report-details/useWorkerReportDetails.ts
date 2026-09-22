import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkerReportService } from '../../service/WorkerReportService';
import type { WorkerReportResponse } from '../../DTOs/Workerreportdetails';

interface Params {
  workerId: number;
  siteId?: string;
  fromDate: string;
  toDate: string;
}

export function useWorkerReportDetails({ workerId, siteId, fromDate, toDate }: Params) {
  const navigate            = useNavigate();
  const workerReportService = useWorkerReportService();

  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [report, setReport]         = useState<WorkerReportResponse | null>(null);

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
    } catch {
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

  // "/reports/worker" - WorkerReportPage (list)
  const handleBack = () => navigate('/reports/worker');

  // "/attendance/:id/edit" - AttendanceEditPage
  const handleAttendanceOpen = (attendanceId: number) =>
    navigate(`/attendance/${attendanceId}/edit`, {
      state: {
        redirect: `/reports/worker/${workerId}`,
        redirectParams: { workerId, siteId, fromDate, toDate },
      },
    });

  // "/workers/:id/edit" - WorkerEditPage
  const handleWorkerOpen = (wId: number) =>
    navigate(`/workers/${wId}/edit`, {
      state: {
        redirect: `/reports/worker/${workerId}`,
        redirectParams: { workerId, siteId, fromDate, toDate },
      },
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