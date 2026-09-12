import { PackageSearch, ChevronLeft, ChevronRight } from 'lucide-react';
import sheetsIcon from '@/assets/icons/sheets.png';
import pdfIcon from '@/assets/icons/pdf.png';
import { Button } from '@/shared/components/ui/button';
import { Header, Actions } from '@/shared/components/Header/Header';
import { SearchFilterBar } from '@/shared/components/SearchFilterBar/SearchFilterBar';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { SummaryCards } from '../../components/InventoryStatCards/InventoryStatCards';
import { SummaryTable } from '../../components/InventorySummaryTable/InventorySummaryTable';
import { MaterialDetail } from '../../components/InventoryMaterialDetail/InventoryMaterialDetail';
import { InventoryFilterDialog } from '../../components/InventoryFilterDialog/InventoryFilterDialog';
import { useInventoryStockReport } from './useInventoryStockReport';
import { exportToExcel, exportToPDF } from '../../utils/exportInventoryReport';
import { usePermission } from '@/shared/hooks/usePermission';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

function TableSkeleton() {
  return (
    <div className="space-y-2 mt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 px-2 py-3 border-b border-slate-100">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export default function InventoryStockReportPage() {
  const navigate = useNavigate();
  const { canView } = usePermission();
  const {
    materialSummary,
    pagedMaterials,
    totalMaterials,
    overallTotals,
    hasSearched,
    selectedMaterial,
    viewMaterial,
    backToOverview,
    loading,
    currentPage,
    totalPages,
    uiPageSize,
    setCurrentPage,
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
    fetchSites,
    handleDateOptionChange,
    handleSearch,
    handleClearFilters,
  } = useInventoryStockReport();

  const hasData = totalMaterials > 0;
  const hasViewAccess = canView('Inventory Stock Report') || canView('Reports');

  useEffect(() => {
    if (!hasViewAccess) navigate('/dashboard', { replace: true });
  }, []);

  if (!hasViewAccess) return null;

  return (
    <div className="min-h-screen w-full py-6">
      <div className="px-4">
        <Header title="Inventory Stock Report">
          <Actions>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <div className="-mt-4">
                <SearchFilterBar
                  appliedFilters={appliedFilters}
                  placeholder="Search inventory report"
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
                    onClick={() => void exportToExcel(materialSummary)}
                    className="h-9 gap-1.5 rounded-md bg-green-700 text-white hover:bg-green-800"
                    style={{ fontSize: 'var(--font-sm)', fontFamily: 'Outfit, sans-serif' }}
                  >
                    <img src={sheetsIcon} alt="" className="w-3.5 h-3.5 object-contain" />
                    Export Excel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      exportToPDF(materialSummary, 'Inventory_Stock_Report', site.label || undefined, dateRange)
                    }
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

      {hasData && (
        <SummaryCards totalMaterials={totalMaterials} totals={overallTotals} />
      )}

      <div className="px-4 pb-24 mt-2">
        {loading ? (
          <TableSkeleton />
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <PackageSearch size={48} className="mb-4 opacity-30" />
            <p className="font-semibold text-slate-500">No Data Found</p>
            <p className="mt-1" style={{ fontSize: 'var(--font-sm)' }}>
              {hasSearched
                ? 'No materials for the selected filters'
                : 'Apply filters and search to view the report'}
            </p>
          </div>
        ) : selectedMaterial ? (
          <MaterialDetail material={selectedMaterial} onBack={backToOverview} />
        ) : (
          <>
            <SummaryTable
              materials={pagedMaterials}
              onView={viewMaterial}
              startIndex={(currentPage - 1) * uiPageSize + 1}
            />
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-2 mt-5">
                <p className="text-slate-400" style={{ fontSize: 'var(--font-xs)' }}>
                  Showing {(currentPage - 1) * uiPageSize + 1}–{Math.min(currentPage * uiPageSize, totalMaterials)} of {totalMaterials} materials
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <ChevronLeft size={15} />
                  </Button>

                  {getPageNumbers(currentPage, totalPages).map((p, idx) =>
                    p === '...' ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="flex h-8 w-8 items-center justify-center text-slate-400 select-none"
                        style={{ fontSize: 'var(--font-sm)' }}
                      >
                        …
                      </span>
                    ) : (
                      <Button
                        key={p}
                        size="icon-sm"
                        variant={p === currentPage ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(p)}
                        style={{ fontSize: 'var(--font-sm)' }}
                      >
                        {p}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <ChevronRight size={15} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <InventoryFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        site={site}
        setSite={setSite}
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
