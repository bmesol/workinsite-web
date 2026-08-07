import { useState, useCallback, useMemo } from 'react';
import { useInventoryStockReportService } from '../../service/InventoryStockReportService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { getWeekRange } from '../../utils/DateUtils';
import { buildMaterialSummary } from '../../utils/TransformInventorySummary';
import type { DateRange, DateRangeOption, SelectOption } from '../../DTOs/WorkerreportProps';
import type { InventoryReportItem } from '../../DTOs/InventoryStockReportProps';

const API_PAGE_SIZE = 100;
const UI_PAGE_SIZE = 10;

interface ValidationError {
  fromDate: string;
  toDate: string;
}

export function useInventoryStockReport() {
  const service = useInventoryStockReportService();
  const siteService = useSiteService();

  const [allItems, setAllItems] = useState<InventoryReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);

  const [site, setSite] = useState<SelectOption>({ label: '', value: '' });
  const [dateRange, setDateRange] = useState<DateRange>(getWeekRange('currentWeek'));
  const [selectedOption, setSelectedOption] = useState<DateRangeOption>('currentWeek');
  const [appliedFilters, setAppliedFilters] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [errors, setErrors] = useState<ValidationError>({ fromDate: '', toDate: '' });

  const [siteOptions, setSiteOptions] = useState<{ id: number; name: string }[]>([]);

  const fetchReport = useCallback(async (
    params: { SiteId?: number; FromDate: string; ToDate: string },
  ) => {
    setLoading(true);
    setSelectedMaterialId(null);
    setCurrentPage(1);
    try {
      const collected: InventoryReportItem[] = [];
      let page = 1;

      while (true) {
        const res = await service.getInventoryStockReport({
          SiteId: params.SiteId,
          FromDate: params.FromDate,
          ToDate: params.ToDate,
          PageNumber: page,
          PageSize: API_PAGE_SIZE,
        });
        const batch = res.items ?? [];
        collected.push(...batch);
        // Stop when: no items returned, last page reached, or partial batch (fewer than requested)
        if (batch.length === 0 || batch.length < API_PAGE_SIZE || page >= (res.totalPages ?? 1)) break;
        page++;
      }

      setAllItems(collected);
    } catch (e) {
      console.error('fetchReport error:', e);
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
    } catch (e) {
      console.error('fetchSites error:', e);
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

    const parts = [
      site.label || 'All Sites',
      `${dateRange.from} – ${dateRange.to}`,
    ];
    setAppliedFilters(parts.join(', '));
    setFilterOpen(false);

    fetchReport({
      SiteId: site.value ? Number(site.value) : undefined,
      FromDate: dateRange.from,
      ToDate: dateRange.to,
    });
  };

  const handleClearFilters = () => {
    const week = getWeekRange('currentWeek');
    setSite({ label: '', value: '' });
    setDateRange(week);
    setSelectedOption('currentWeek');
    setAppliedFilters('');
    setErrors({ fromDate: '', toDate: '' });
    setAllItems([]);
    setSelectedMaterialId(null);
    setCurrentPage(1);
    setHasSearched(false);
  };

  const materialSummary = useMemo(() => buildMaterialSummary(allItems), [allItems]);

  const totalMaterials = materialSummary.length;

  const totalPages = Math.max(1, Math.ceil(totalMaterials / UI_PAGE_SIZE));

  const pagedMaterials = useMemo(() => {
    const start = (currentPage - 1) * UI_PAGE_SIZE;
    return materialSummary.slice(start, start + UI_PAGE_SIZE);
  }, [materialSummary, currentPage]);

  const overallTotals = useMemo(
    () =>
      materialSummary.reduce(
        (acc, m) => {
          acc.purchased += m.totalPurchased;
          acc.used += m.totalUsed;
          acc.transferIn += m.totalTransferIn;
          acc.transferOut += m.totalTransferOut;
          acc.available += m.totalAvailable;
          return acc;
        },
        { purchased: 0, used: 0, transferIn: 0, transferOut: 0, available: 0 },
      ),
    [materialSummary],
  );

  const selectedMaterial = useMemo(
    () =>
      selectedMaterialId == null
        ? null
        : materialSummary.find((m) => m.materialId === selectedMaterialId) ?? null,
    [selectedMaterialId, materialSummary],
  );

  const viewMaterial = (materialId: number) => setSelectedMaterialId(materialId);
  const backToOverview = () => setSelectedMaterialId(null);

  const siteSelectOptions = siteOptions.map(s => ({ label: s.name, value: String(s.id) }));

  return {
    // data
    materialSummary,
    pagedMaterials,
    totalMaterials,
    overallTotals,
    hasSearched,
    // drill-down
    selectedMaterial,
    viewMaterial,
    backToOverview,
    // status
    loading,
    // pagination
    currentPage,
    totalPages,
    uiPageSize: UI_PAGE_SIZE,
    setCurrentPage,
    // filters
    site,
    setSite,
    dateRange,
    setDateRange,
    selectedOption,
    appliedFilters,
    filterOpen,
    setFilterOpen,
    errors,
    siteSelectOptions,
    // actions
    fetchSites,
    handleDateOptionChange,
    handleSearch,
    handleClearFilters,
  };
}