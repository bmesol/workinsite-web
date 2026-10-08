import { Building2 } from 'lucide-react';
import sheetsIcon from '@/assets/icons/sheets.png';
import pdfIcon from '@/assets/icons/pdf.png';
import { Button } from '@/shared/components/ui/button';
import { Header, Actions } from '@/shared/components/Header/Header';
import { SearchFilterBar } from '@/shared/components/SearchFilterBar/SearchFilterBar';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { SiteExpenseStatCards } from '../../components/SiteExpenseStatCards/SiteExpenseStatCards';
import { SiteExpenseSummaryTable } from '../../components/SiteExpenseSummaryTable/SiteExpenseSummaryTable';
import { SiteExpenseDetail } from '../../components/SiteExpenseDetail/SiteExpenseDetail';
import { SiteExpenseFilterDialog } from '../../components/SiteExpenseFilterDialog/SiteExpenseFilterDialog';
import { useSiteExpenseReport } from './useSiteExpenseReport';
import { exportToExcel, exportToPDF } from '../../utils/exportSiteExpenseReport';
import { usePermission } from '@/shared/hooks/usePermission';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function TableSkeleton() {
  return (
    <div className="space-y-2 mt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 px-2 py-3 border-b border-slate-100">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

export default function SiteExpenseReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { canView } = usePermission();
  const {
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
  } = useSiteExpenseReport();

  const hasData = allItems.length > 0;
  const hasViewAccess = canView('Site Expense Report') || canView('Reports');

  useEffect(() => {
    if (!hasViewAccess) {
      navigate('/dashboard', { replace: true });
      return;
    }
    const state = location.state as { restore?: { fromDate: string; toDate: string; filterSiteId?: number; selectedSiteId: number; activeTab?: 'purchases' | 'materials' | 'clientTransactions' | 'workers' } } | null;
    if (state?.restore) {
      void restoreView(state.restore);
      // Clear restore flag from location so refresh doesn't re-trigger it
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      // Auto-load current week on initial open
      void fetchReport({ FromDate: dateRange.from, ToDate: dateRange.to });
    }
  }, []);

  if (!hasViewAccess) return null;

  return (
    <div className="min-h-screen w-full py-6">
      <div className="px-4">
        {/* ── Desktop / tablet: title + filter bar + export buttons on one row ── */}
        <div className="hidden sm:block">
        <Header title="Site-Wise Expense Summary">
          <Actions>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <div className="-mt-4">
                <SearchFilterBar
                  appliedFilters={appliedFilters}
                  placeholder="Search expense report"
                  onFilterOpen={() => {
                    fetchSites('');
                    setFilterOpen(true);
                  }}
                  onClearSearch={handleClearFilters}
                />
              </div>
              {hasData && (
                <>
                  <Button
                    onClick={() => void exportToExcel(allItems, 'Site_Expense_Report', dateRange)}
                    className="h-9 gap-1.5 rounded-md bg-green-700 text-white hover:bg-green-800"
                    style={{ fontSize: 'var(--font-sm)', fontFamily: 'Outfit, sans-serif' }}
                  >
                    <img src={sheetsIcon} alt="" className="w-3.5 h-3.5 object-contain" />
                    Export Excel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => void exportToPDF(allItems, 'Site_Expense_Report', dateRange)}
                    className="h-9 gap-1.5 rounded-md border-red-400 text-red-600 hover:bg-red-50 hover:text-red-700"
                    style={{ fontSize: 'var(--font-sm)', fontFamily: 'Outfit, sans-serif' }}
                  >
                    <img src={pdfIcon} alt="" className="w-3.5 h-3.5 object-contain" />
                    Download PDF
                  </Button>
                </>
              )}
            </div>
          </Actions>
        </Header>
        </div>

        {/* ── Mobile: 2-line heading → full-width filter → equal-width export buttons ── */}
        <div className="sm:hidden">
          <h2 className="text-secondary font-bold text-xl leading-tight pt-4">
            Site-Wise Expense<br />Summary
          </h2>
          <SearchFilterBar
            appliedFilters={appliedFilters}
            placeholder="Search expense report"
            onFilterOpen={() => {
              fetchSites('');
              setFilterOpen(true);
            }}
            onClearSearch={handleClearFilters}
          />
          {hasData && (
            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => void exportToExcel(allItems, 'Site_Expense_Report', dateRange)}
                className="flex-1 h-9 gap-1.5 rounded-md bg-green-700 text-white hover:bg-green-800"
                style={{ fontSize: 'var(--font-sm)', fontFamily: 'Outfit, sans-serif' }}
              >
                <img src={sheetsIcon} alt="" className="w-3.5 h-3.5 object-contain" />
                Export Excel
              </Button>
              <Button
                variant="outline"
                onClick={() => void exportToPDF(allItems, 'Site_Expense_Report', dateRange)}
                className="flex-1 h-9 gap-1.5 rounded-md border-red-400 text-red-600 hover:bg-red-50 hover:text-red-700"
                style={{ fontSize: 'var(--font-sm)', fontFamily: 'Outfit, sans-serif' }}
              >
                <img src={pdfIcon} alt="" className="w-3.5 h-3.5 object-contain" />
                Download PDF
              </Button>
            </div>
          )}
        </div>
      </div>

      {hasData && (
        <SiteExpenseStatCards
          totalSites={allItems.length}
          totalPurchaseAmount={overallTotals.totalPurchaseAmount}
          totalClientTransactionAmount={overallTotals.totalClientTransactionAmount}
          totalWorkerSalaryAmount={overallTotals.totalWorkerSalaryAmount}
          totalExpense={overallTotals.totalExpense}
        />
      )}

      <div className="px-4 pb-24 mt-2">
        {loading ? (
          <TableSkeleton />
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Building2 size={48} className="mb-4 opacity-30" />
            <p className="font-semibold text-slate-500">No Data Found</p>
            <p className="mt-1" style={{ fontSize: 'var(--font-sm)' }}>
              {hasSearched
                ? 'No expense data for the selected filters'
                : 'Apply filters and search to view the report'}
            </p>
          </div>
        ) : selectedSite ? (
          <SiteExpenseDetail
            site={selectedSite}
            onBack={backToOverview}
            dateRange={dateRange}
            filterSiteId={filterSiteId}
            defaultTab={restoredDefaultTab}
          />
        ) : (
          <SiteExpenseSummaryTable sites={allItems} onView={viewSite} />
        )}
      </div>

      <SiteExpenseFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        sites={sites}
        setSites={setSites}
        siteSelectOptions={siteSelectOptions}
        fetchSites={fetchSites}
        selectedOption={selectedOption}
        dateRange={dateRange}
        setDateRange={setDateRange}
        handleDateOptionChange={handleDateOptionChange}
        errors={errors}
        handleSearch={handleSearch}
      />
    </div>
  );
}
