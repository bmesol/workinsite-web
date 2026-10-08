import { useState, useCallback, useMemo } from 'react';
import { useSiteExpenseReportService } from '../../service/SiteExpenseReportService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { getWeekRangeHyphen as getWeekRange } from '@/shared/utils/formatters';
import type { DateRange, DateRangeOption, SelectOption } from '../../DTOs/WorkerreportProps';
import type { SiteExpenseReportItem } from '../../DTOs/SiteExpenseReportProps';

type TabKey = 'purchases' | 'materials' | 'clientTransactions' | 'workers';

interface RestoreParams {
  fromDate: string;
  toDate: string;
  filterSiteId?: number;
  selectedSiteId: number;
  activeTab?: TabKey;
}

interface ValidationError {
  fromDate: string;
  toDate: string;
}

export function useSiteExpenseReport() {
  const service = useSiteExpenseReportService();
  const siteService = useSiteService();

  const [allItems, setAllItems] = useState<SiteExpenseReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);

  const [sites, setSites] = useState<SelectOption[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>(getWeekRange('currentWeek'));
  const [selectedOption, setSelectedOption] = useState<DateRangeOption>('currentWeek');
  const [appliedFilters, setAppliedFilters] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [errors, setErrors] = useState<ValidationError>({ fromDate: '', toDate: '' });

  const [siteOptions, setSiteOptions] = useState<{ id: number; name: string }[]>([]);
  const [restoredDefaultTab, setRestoredDefaultTab] = useState<TabKey | undefined>();

  const fetchReport = useCallback(async (
    params: { SiteId?: number; FromDate: string; ToDate: string },
  ) => {
    setLoading(true);
    setSelectedSiteId(null);
    try {
      const res = await service.getSiteExpenseReport({
        SiteId: params.SiteId,
        FromDate: params.FromDate,
        ToDate: params.ToDate,
      });
      setAllItems(Array.isArray(res) ? res : []);
    } catch {
      setAllItems([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  }, [service]);

  const fetchSites = async (text: string) => {
    try {
      const res = await siteService.getSites({ searchString: text });
      setSiteOptions((res ?? []).slice(0, 5));
    } catch {
    }
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
    const err: ValidationError = { fromDate: '', toDate: '' };
    if (!dateRange.from) err.fromDate = 'From Date is required';
    if (!dateRange.to) err.toDate = 'To Date is required';
    setErrors(err);
    if (err.fromDate || err.toDate) return;

    const siteLabel = sites.length > 0 ? sites.map((s) => s.label).join(', ') : 'All Sites';
    const parts = [siteLabel, `${dateRange.from} – ${dateRange.to}`];
    setAppliedFilters(parts.join(', '));
    setFilterOpen(false);

    fetchReport({
      SiteId: sites.length > 0 ? Number(sites[0].value) : undefined,
      FromDate: dateRange.from,
      ToDate: dateRange.to,
    });
  };

  const handleClearFilters = () => {
    const week = getWeekRange('currentWeek');
    setSites([]);
    setDateRange(week);
    setSelectedOption('currentWeek');
    setAppliedFilters('');
    setErrors({ fromDate: '', toDate: '' });
    setSelectedSiteId(null);
    fetchReport({ FromDate: week.from, ToDate: week.to });
  };

  const overallTotals = useMemo(
    () =>
      allItems.reduce(
        (acc, site) => {
          acc.totalPurchaseAmount += Number(site.totalPurchaseAmount);
          acc.totalClientTransactionAmount += Number(site.totalClientTransactionAmount);
          acc.totalWorkerSalaryAmount += Number(site.totalWorkerSalaryAmount);
          acc.totalExpense += Number(site.totalExpense);
          return acc;
        },
        {
          totalPurchaseAmount: 0,
          totalClientTransactionAmount: 0,
          totalWorkerSalaryAmount: 0,
          totalExpense: 0,
        },
      ),
    [allItems],
  );

  const selectedSite = useMemo(
    () =>
      selectedSiteId == null
        ? null
        : allItems.find((s) => s.siteId === selectedSiteId) ?? null,
    [selectedSiteId, allItems],
  );

  const viewSite = (siteId: number) => setSelectedSiteId(siteId);
  const backToOverview = () => setSelectedSiteId(null);

  const siteSelectOptions = siteOptions.map((s) => ({ label: s.name, value: String(s.id) }));

  const filterSiteId = sites.length > 0 ? Number(sites[0].value) : undefined;

  const restoreView = useCallback(async (params: RestoreParams) => {
    setDateRange({ from: params.fromDate, to: params.toDate });
    setLoading(true);
    setSelectedSiteId(null);
    if (params.activeTab) setRestoredDefaultTab(params.activeTab);
    try {
      const res = await service.getSiteExpenseReport({
        SiteId: params.filterSiteId,
        FromDate: params.fromDate,
        ToDate: params.toDate,
      });
      const items = Array.isArray(res) ? res : [];
      setAllItems(items);
      setSelectedSiteId(params.selectedSiteId);
      setHasSearched(true);
      setAppliedFilters(`${params.fromDate} – ${params.toDate}`);
    } catch {
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  }, [service]);

  return {
    allItems,
    overallTotals,
    hasSearched,
    selectedSite,
    viewSite,
    backToOverview,
    loading,
    sites,
    setSites,
    dateRange,
    setDateRange,
    selectedOption,
    appliedFilters,
    filterOpen,
    setFilterOpen,
    errors,
    siteSelectOptions,
    fetchReport,
    fetchSites,
    handleDateOptionChange,
    handleSearch,
    handleClearFilters,
    filterSiteId,
    restoreView,
    restoredDefaultTab,
  };
}
