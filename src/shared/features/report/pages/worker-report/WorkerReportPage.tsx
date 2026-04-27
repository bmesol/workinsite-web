import { useEffect, useState } from "react";
import { WorkerReportUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Users, SlidersHorizontal, X } from "lucide-react";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { Header, Actions } from "@/shared/components/Header/Header";
import { StatsBar } from "../../components/StatsBar/StatsBar";
import { WorkerReportCard } from "../../components/WorkerReportCard/WorkerReportCard";
import { DateFilter } from "../../components/DateFilter/DateFilter";
import { useWorkerReport } from "./useWorkerReport";

function CardSkeleton() {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-100">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export default function WorkerReportPage() {
  const navigate = useNavigate();
  const {
    reports,
    totalAmount,
    totalWorkers,
    loading,
    paginationLoading,
    hasMore,
    site,
    setSite,
    worker,
    setWorker,
    dateRange,
    setDateRange,
    selectedOption,
    appliedFilters,
    filterOpen,
    setFilterOpen,
    errors,
    siteSelectOptions,
    workerSelectOptions,
    fetchReports,
    fetchSites,
    fetchWorkers,
    handleDateOptionChange,
    handleSearch,
    handleClearFilters,
  } = useWorkerReport();

  const [siteSearch, setSiteSearch] = useState("");
  const [workerSearch, setWorkerSearch] = useState("");

  useEffect(() => {
    fetchReports(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchSites(siteSearch), 300);
    return () => clearTimeout(t);
  }, [siteSearch]);

  useEffect(() => {
    const t = setTimeout(() => fetchWorkers(workerSearch), 300);
    return () => clearTimeout(t);
  }, [workerSearch]);

  return (
    <div className="min-h-screen w-full  py-6 ">
      {/* ── Header ── */}
      <div className="px-4">
        <Header title="Worker Report">
          <Actions>
            {appliedFilters && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearFilters}
                className="text-red-500 hover:text-red-600"
              >
                <X size={14} className="mr-1" /> Clear
              </Button>
            )}
           
            <Button onClick={() => setFilterOpen(true)}>
              <SlidersHorizontal size={14} className="mr-1" /> Filter
            </Button>
          </Actions>
        </Header>
        {appliedFilters && (
          <p className="text-xs text-slate-500 truncate max-w-[220px] pb-2">
            {appliedFilters}
          </p>
        )}
      </div>

      {/* ── Stats ── */}
      <StatsBar totalWorkers={totalWorkers} totalAmount={totalAmount} />

      {/* ── List ── */}
      <div className="px-4 space-y-2 pb-24">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Users size={48} className="mb-4 opacity-30" />
            <p className="font-semibold text-slate-500">No Data Found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {reports.map((item) => (
              <WorkerReportCard
                key={item.workerId}
                workerName={item.workerName}
                workerCategoryName={item.workerCategoryName}
                amount={item.amount}
                onPress={() =>
                  navigate(WorkerReportUrls.details(item.workerId), {
                    state: {
                      fromDate: dateRange.from,
                      toDate: dateRange.to,
                      siteId: site.value,
                    },
                  })
                }
              />
            ))}
            {hasMore && (
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchReports(false)}
                  disabled={paginationLoading}
                >
                  {paginationLoading ? "Loading..." : "View More"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Filter Sheet ── */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent
          side="right"
          className="w-full sm:w-[400px] overflow-y-auto [&>button:first-child]:hidden px-4"
        >
          <Header title="Filter Worker Reports">
            <Actions>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFilterOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Actions>
          </Header>
          <div className="space-y-5 mt-6">
            {/* Site */}
            <ComboboxField
              id="site"
              label="Site"
              items={siteSelectOptions}
              selectedValue={site.value}
              onValueChange={(val) => {
                const found = siteSelectOptions.find((s) => s.value === val);
                setSite({ label: found?.label ?? "", value: val });
              }}
              onSearch={(val) => setSiteSearch(val)}
            />

            {/* Worker */}
            <ComboboxField
              id="worker"
              label="Worker"
              items={workerSelectOptions}
              selectedValue={worker.value}
              onValueChange={(val) => {
                const found = workerSelectOptions.find((w) => w.value === val);
                setWorker({ label: found?.label ?? "", value: val });
              }}
              onSearch={(val) => setWorkerSearch(val)}
            />

            {/* Date Filter */}
            <DateFilter
              selectedOption={selectedOption}
              dateRange={dateRange}
              setDateRange={setDateRange}
              onOptionChange={handleDateOptionChange}
              errors={errors}
            />

            <Button
              className="w-full h-12 text-base font-semibold transition-all duration-200 cursor-pointer hover:shadow-lg active:translate-y-0 active:shadow-md"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
