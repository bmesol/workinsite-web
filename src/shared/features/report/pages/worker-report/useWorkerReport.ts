import { useState, useMemo, useCallback } from 'react';
import { useWorkerReportService } from '../../service/WorkerReportService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useWorkerService } from '@/shared/features/workers/service/WorkerService';
import type {
  WorkerReportSummaryItem,
  DateRange,
  DateRangeOption,
  SiteOption,
  WorkerOption,
  SelectOption,
} from '../../DTOs/WorkerreportProps';


const PAGE_SIZE = 10;


const formatDate = (date: Date): string => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

export const getWeekRange = (option: 'currentWeek' | 'lastWeek'): DateRange => {
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const diffToMon = day === 0 ? -6 : 1 - day;

  if (option === 'currentWeek') {
    const from = new Date(today);
    from.setDate(today.getDate() + diffToMon);
    const to = new Date(from);
    to.setDate(from.getDate() + 6);
    return { from: formatDate(from), to: formatDate(to) };
  } else {
    const from = new Date(today);
    from.setDate(today.getDate() + diffToMon - 7);
    const to = new Date(from);
    to.setDate(from.getDate() + 6);
    return { from: formatDate(from), to: formatDate(to) };
  }
};


interface ValidationError {
  fromDate: string;
  toDate: string;
}

const validateDates = (from: string, to: string): ValidationError => {
  const err: ValidationError = { fromDate: '', toDate: '' };
  if (!from && !to) { err.fromDate = 'Date is required'; return err; }
  if (!from) { err.fromDate = 'From Date is required'; return err; }
  if (!to)   { err.toDate  = 'To Date is required';   return err; }

  // parse dd-mm-yyyy
  const [fd, fm, fy] = from.split('-').map(Number);
  const [td, tm, ty] = to.split('-').map(Number);
  const fromDate = new Date(fy, fm - 1, fd);
  const toDate   = new Date(ty, tm - 1, td);
  if (fromDate > toDate)
    err.toDate = 'To Date must be on or after From Date';
  return err;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWorkerReport() {
  const workerReportService = useWorkerReportService();
  const siteService         = useSiteService();
  const workerService       = useWorkerService();

  // list state
  const [reports, setReports]             = useState<WorkerReportSummaryItem[]>([]);
  const [totalAmount, setTotalAmount]     = useState(0);
  const [loading, setLoading]             = useState(false);
  const [pageNumber, setPageNumber]       = useState(1);
  const [hasMore, setHasMore]             = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);

  // filter state
  const [site, setSite]     = useState<SelectOption>({ label: '', value: '' });
  const [worker, setWorker] = useState<SelectOption>({ label: '', value: '' });
  const [selectedOption, setSelectedOption] = useState<DateRangeOption>('currentWeek');
  const [dateRange, setDateRange]           = useState<DateRange>(getWeekRange('currentWeek'));
  const [appliedFilters, setAppliedFilters] = useState('');
  const [filterOpen, setFilterOpen]         = useState(false);

  // validation
  const [errors, setErrors] = useState<ValidationError>({ fromDate: '', toDate: '' });

  // dropdown options
  const [allSites, setAllSites]           = useState<SiteOption[]>([]);
  const [siteOptions, setSiteOptions]     = useState<SiteOption[]>([]);
  const [workerOptions, setWorkerOptions] = useState<WorkerOption[]>([]);


  const fetchReports = useCallback(async (reset = false, override?: Partial<{
    SiteId: number | undefined;
    WorkerId: number | undefined;
    FromDate: string;
    ToDate: string;
  }>) => {
    if (!reset && !hasMore) return;
    reset ? setLoading(true) : setPaginationLoading(true);

    try {
      const currentPage = reset ? 1 : pageNumber;
      const res = await workerReportService.getAttendanceReportSummary({
        SiteId:     override?.SiteId     ?? (site.value   ? Number(site.value)   : undefined),
        WorkerId:   override?.WorkerId   ?? (worker.value ? Number(worker.value) : undefined),
        FromDate:   override?.FromDate   ?? dateRange.from,
        ToDate:     override?.ToDate     ?? dateRange.to,
        PageNumber: currentPage,
        PageSize:   PAGE_SIZE,
      });

      const items = res.items ?? [];
      if (reset) {
        setReports(items);
        setPageNumber(2);
      } else {
        setReports(prev => [...prev, ...items]);
        setPageNumber(n => n + 1);
      }
      setTotalAmount(res.totalAmount ?? 0);
      setHasMore(res.totalPages > res.pageNumber);
    } catch (e) {
      console.error('fetchReports error:', e);
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  }, [hasMore, pageNumber, site, worker, dateRange, workerReportService]);


  const fetchSites = async (text: string) => {
    let source = allSites;
    if (!source.length) {
      const sites = await siteService.getSites({ status: 'Working' });
      if (!sites) return;
      setAllSites(sites);
      source = sites;
    }
    const lower = text.toLowerCase();
    setSiteOptions(
      text ? source.filter(s => s.name.toLowerCase().includes(lower)) : source,
    );
  };

  const fetchWorkers = async (text: string) => {
    const res = await workerService.getWorkers(text ? { WorkerName: text } : {});
    setWorkerOptions((res ?? []).slice(0, 5));
  };


  const handleDateOptionChange = (option: DateRangeOption) => {
    setSelectedOption(option);
    if (option !== 'custom') {
      setDateRange(getWeekRange(option));
    } else {
      setDateRange({ from: '', to: '' });
    }
  };

  const handleSearch = () => {
    const err = validateDates(dateRange.from, dateRange.to);
    setErrors(err);
    if (err.fromDate || err.toDate) return;

    const filterText = [site.label, worker.label, dateRange.from, dateRange.to]
      .filter(Boolean).join(', ');
    setAppliedFilters(filterText);
    setFilterOpen(false);
    fetchReports(true);
  };

  const handleClearFilters = () => {
    const week = getWeekRange('currentWeek');
    setSite({ label: '', value: '' });
    setWorker({ label: '', value: '' });
    setDateRange(week);
    setSelectedOption('currentWeek');
    setAppliedFilters('');
    setErrors({ fromDate: '', toDate: '' });
    fetchReports(true, {
      SiteId: undefined, WorkerId: undefined,
      FromDate: week.from, ToDate: week.to,
    });
  };

  // computed
  const totalWorkers = reports.length;

  const siteSelectOptions   = useMemo(() =>
    siteOptions.map(s => ({ label: s.name, value: String(s.id) })), [siteOptions]);

  const workerSelectOptions = useMemo(() =>
    workerOptions.map(w => ({
      label: `${w.name} [${w.workerCategory.name}]`,
      value: String(w.id),
    })), [workerOptions]);

  return {
    // data
    reports, totalAmount, totalWorkers, loading, paginationLoading, hasMore,
    // filters
    site, setSite,
    worker, setWorker,
    dateRange, setDateRange,
    selectedOption,
    appliedFilters,
    filterOpen, setFilterOpen,
    errors,
    siteSelectOptions,
    workerSelectOptions,
    // handlers
    fetchReports,
    fetchSites,
    fetchWorkers,
    handleDateOptionChange,
    handleSearch,
    handleClearFilters,
  };
}