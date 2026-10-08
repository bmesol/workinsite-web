import { Header, Actions } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import sheetsIcon from "@/assets/icons/sheets.png";
import pdfIcon from "@/assets/icons/pdf.png";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar/SearchFilterBar";
import SupervisorAttendanceCard from "@/shared/components/SupervisorAttendanceCard/SupervisorAttendanceCard";
import { DateFilter } from "../../components/DateFilter/DateFilter";
import { useSupervisorAttendanceList } from "./useSuperVisorAttendanceList";
import { useLanguage } from "@/shared/hooks/useLanguageContext";
import { usePermission } from "@/shared/hooks/usePermission";
import { useNavigate } from "react-router-dom";
import type { SupervisorAttendance } from "../../DTOs/SupervisorAttendanceProps";
import { Loader2, ClipboardList } from "lucide-react";
import {
  exportSupervisorAttendanceToExcel,
  exportSupervisorAttendanceToPDF,
} from "../../utils/exportSupervisorAttendanceReport";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useEffect } from "react";

const formatTime12h = (time?: string): string | undefined => {
  if (!time) return undefined;
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return undefined;
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const SupervisorAttendanceListPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { canView } = usePermission();

  const {
    attendances,
    loading,
    paginationLoading,
    hasMore,
    appliedFilters,
    filterOpen,
    setFilterOpen,
    supervisor,
    setSupervisor,
    dateRange,
    setDateRange,
    selectedOption,
    handleOptionChange,
    error,
    supervisorDetails,
    fetchSupervisors,
    fetchAttendances,
    handleSearch,
    handleClearSearch,
    isFiltered,
  } = useSupervisorAttendanceList();

  const hasViewAccess =
    canView("Supervisor Attendance Report") ||
    canView("Attendance Report") ||
    canView("Reports");

  useEffect(() => {
    if (!hasViewAccess) navigate("/dashboard", { replace: true });
  }, []);

  if (!hasViewAccess) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  const hasData = attendances.length > 0;

  return (
    <div className="min-h-screen w-full py-6">
      <div className="px-4">
        {/* ── Desktop: title + filter bar + export buttons on one row ── */}
        <div className="hidden sm:block">
          <Header title="Supervisor Attendance">
            <Actions>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <div className="-mt-4">
                  <SearchFilterBar
                    appliedFilters={appliedFilters}
                    placeholder={t("Search supervisor attendance")}
                    onFilterOpen={() => setFilterOpen(true)}
                    onClearSearch={handleClearSearch}
                  />
                </div>
                {hasData && (
                  <>
                    <Button
                      onClick={() =>
                        void exportSupervisorAttendanceToExcel(
                          attendances,
                          dateRange,
                          "Supervisor_Attendance_Report",
                        )
                      }
                      className="h-9 gap-1.5 rounded-md bg-green-700 text-white hover:bg-green-800"
                      style={{
                        fontSize: "var(--font-sm)",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      <img
                        src={sheetsIcon}
                        alt=""
                        className="w-3.5 h-3.5 object-contain"
                      />
                      Export Excel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        void exportSupervisorAttendanceToPDF(
                          attendances,
                          dateRange,
                          "Supervisor_Attendance_Report",
                        )
                      }
                      className="h-9 gap-1.5 rounded-md border-red-400 text-red-600 hover:bg-red-50 hover:text-red-700"
                      style={{
                        fontSize: "var(--font-sm)",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      <img
                        src={pdfIcon}
                        alt=""
                        className="w-3.5 h-3.5 object-contain"
                      />
                      Download PDF
                    </Button>
                  </>
                )}
              </div>
            </Actions>
          </Header>
        </div>

        {/* ── Mobile: title → filter bar → export buttons ── */}
        <div className="sm:hidden">
          <h2 className="text-secondary font-bold text-xl leading-tight pt-4">
            Supervisor Attendance
          </h2>
          <SearchFilterBar
            appliedFilters={appliedFilters}
            placeholder={t("Search supervisor attendance")}
            onFilterOpen={() => setFilterOpen(true)}
            onClearSearch={handleClearSearch}
          />
          {hasData && (
            <div className="flex gap-3 mt-4">
              <Button
                onClick={() =>
                  void exportSupervisorAttendanceToExcel(
                    attendances,
                    dateRange,
                    "Supervisor_Attendance_Report",
                  )
                }
                className="flex-1 h-9 gap-1.5 rounded-md bg-green-700 text-white hover:bg-green-800"
                style={{
                  fontSize: "var(--font-sm)",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                <img
                  src={sheetsIcon}
                  alt=""
                  className="w-3.5 h-3.5 object-contain"
                />
                Export Excel
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  void exportSupervisorAttendanceToPDF(
                    attendances,
                    dateRange,
                    "Supervisor_Attendance_Report",
                  )
                }
                className="flex-1 h-9 gap-1.5 rounded-md border-red-400 text-red-600 hover:bg-red-50 hover:text-red-700"
                style={{
                  fontSize: "var(--font-sm)",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                <img
                  src={pdfIcon}
                  alt=""
                  className="w-3.5 h-3.5 object-contain"
                />
                Download PDF
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── List ── */}
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
        {attendances.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-400">
            <ClipboardList size={48} className="mb-4 opacity-30" />
            <p className="font-semibold text-slate-500">No Data Found</p>
            <p className="text-sm mt-1">
              No attendance records found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          attendances.map((item: SupervisorAttendance) => (
            <SupervisorAttendanceCard
              key={item.id}
              supervisorName={item.supervisor[0]?.name ?? ""}
              supervisorRole={item.supervisor[0]?.role?.name ?? ""}
              date={item.date}
              time={item.time}
              address={item.currentLocation?.address ?? ""}
            />
          ))
        )}
      </div>

      {/* ── View More ── */}
      {hasMore && attendances.length > 0 && (
        <div className="px-4 flex justify-end mt-4">
          {paginationLoading ? (
            <Loader2
              className="animate-spin"
              size={24}
              style={{ color: "var(--secondary)" }}
            />
          ) : (
            <Button variant="outline" onClick={() => fetchAttendances()}>
              View More
            </Button>
          )}
        </div>
      )}

      {/* ── Filter Dialog ── */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[var(--card)]">
          <DialogHeader>
            <DialogTitle className="text-xl">Filter Supervisor Attendance</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <ComboboxField
              id="supervisor"
              label="Supervisor"
              items={supervisorDetails}
              selectedValue={supervisor.value}
              onValueChange={(val) => {
                const found = supervisorDetails.find((i) => i.value === val);
                if (found?.allItems) setSupervisor(found.allItems as any);
              }}
              onSearch={fetchSupervisors}
            />
            <DateFilter
              selectedOption={selectedOption}
              dateRange={dateRange}
              setDateRange={setDateRange}
              onOptionChange={handleOptionChange}
              errors={{ fromDate: error.fromDate, toDate: error.toDate }}
            />
            <Button
              type="button"
              onClick={handleSearch}
              disabled={!isFiltered}
              className="w-full h-11 font-semibold"
              style={{ fontSize: 'var(--font-md)' }}
            >
              Search
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default SupervisorAttendanceListPage;
