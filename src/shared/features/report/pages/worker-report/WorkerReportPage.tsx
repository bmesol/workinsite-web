import { useEffect, useState } from "react";
import { WorkerReportUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Users } from "lucide-react";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { Header, Actions } from "@/shared/components/Header/Header";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar/SerchFilterBar";
import { StatsBar } from "../../components/StatsBar/StatsBar";
import { WorkerReportCard } from "../../components/WorkerReportCard/WorkerReportCard";
import { DateFilter } from "../../components/DateFilter/DateFilter";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useWorkerReport } from "./useWorkerReport";
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { X } from "lucide-react";

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
  const { t } = useLanguage();
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
    const timer = setTimeout(() => fetchSites(siteSearch), 300);
    return () => clearTimeout(timer);
  }, [siteSearch]);

  useEffect(() => {
    const timer = setTimeout(() => fetchWorkers(workerSearch), 300);
    return () => clearTimeout(timer);
  }, [workerSearch]);

  return (
    <div className="min-h-screen w-full py-6">

      {/* ── Header + SearchFilterBar ── */}
      <div className="px-4">
        <Header title={t('Worker Report')}>
          <Actions>
            <SearchFilterBar
              appliedFilters={appliedFilters}
              placeholder={t('Search worker report')}
              onFilterOpen={() => setFilterOpen(true)}
              onClearSearch={handleClearFilters}
            />
          </Actions>
        </Header>
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
                  {paginationLoading ? "Loading..." : t("View More")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Filter AlertDialog ── */}
      <AlertDialog open={filterOpen} onOpenChange={setFilterOpen}>
        <AlertDialogContent className="sm:max-w-md bg-white dark:bg-[var(--card)] flex flex-col max-h-[80vh]">

          {/* Header + Close icon */}
          <AlertDialogHeader className="relative">
            <AlertDialogTitle>{t('Filter Worker Reports')}</AlertDialogTitle>
            <AlertDialogDescription className="sr-only">
              Filter by site, worker and date
            </AlertDialogDescription>
            <button
              onClick={() => setFilterOpen(false)}
              className="absolute top-0 right-0 p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </AlertDialogHeader>

          {/* Scrollable content */}
          <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1">
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

            <ComboboxField
              id="worker"
              label={t('Worker')}
              items={workerSelectOptions}
              selectedValue={worker.value}
              onValueChange={(val) => {
                const found = workerSelectOptions.find((w) => w.value === val);
                setWorker({ label: found?.label ?? "", value: val });
              }}
              onSearch={(val) => setWorkerSearch(val)}
            />

            <DateFilter
              selectedOption={selectedOption}
              dateRange={dateRange}
              setDateRange={setDateRange}
              onOptionChange={handleDateOptionChange}
              errors={errors}
            />
          </div>

          <AlertDialogFooter className="pt-2">
            <AlertDialogAction asChild>
              <Button
                className="w-full h-12 text-base font-semibold"
                onClick={handleSearch}
              >
                Search
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}