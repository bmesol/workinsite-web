import { useParams, useLocation } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  ArrowLeft,
  RefreshCw,
  FileText,
  IndianRupee,
  Calendar,
  MapPin,
  ChevronRight,
  HardHat,
} from "lucide-react";
import { useWorkerReportDetails } from "./useWorkerReportDetails";
import { formatINR } from "../../utils/DateUtils";
import { Header, Actions } from "@/shared/components/Header/Header";
import { WorkerReportCard } from "../../components/WorkerReportCard/WorkerReportCard";
import { RecordCard } from "../../components/RecordCard/RecordCard";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <div className="flex gap-3">
        <Skeleton className="flex-1 h-20 rounded-xl" />
        <Skeleton className="flex-1 h-20 rounded-xl" />
      </div>
      <Skeleton className="h-16 rounded-xl" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16 rounded-xl" />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WorkerReportDetailsPage() {
  const { workerId } = useParams<{ workerId: string }>();
  const location = useLocation();
  const { fromDate, toDate, siteId } = location.state ?? {};

  const {
    loading,
    refreshing,
    report,
    totalAmount,
    handleBack,
    handleRefresh,
    handleAttendanceOpen,
    handleWorkerOpen,
  } = useWorkerReportDetails({
    workerId: Number(workerId),
    siteId,
    fromDate,
    toDate,
  });

  const hasItems = (report?.items?.length ?? 0) > 0;
  const firstItem = report?.items?.[0];

  return (
    <div className="min-h-screen ">
      {/* ── Header ── */}
      <div className=" px-4 pt-4 pb-6 ">
        <Header
          title="Worker Report Details"
          leading={
            <Button size="icon" variant="ghost" onClick={handleBack}>
              <ArrowLeft size={20} />
            </Button>
          }
        >
          <Actions>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <RefreshCw
                size={14}
                className={`mr-1 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </Actions>
        </Header>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <DetailSkeleton />
      ) : !hasItems ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mb-4">
            <FileText size={36} className="opacity-40" />
          </div>
          <p className="font-semibold text-slate-500 text-lg">
            No Report Details Found
          </p>
          <p className="text-sm mt-1 text-center px-8">
            Attendance records will appear here once available
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-4 -mt-6 pb-24">
          {/* ── Summary Cards ── */}
          <div className="flex gap-3">
            {/* Total Records */}
            <div className="flex-1 bg-white rounded-2xl border-l-4 border-blue-400 shadow-sm p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileText size={20} className="text-blue-500" />
              </div>
              <div>
                <p
                  className="text-sm  font-medium"
                  style={{ color: "var(--gray-color)" }}
                >
                  Total Records
                </p>
                <p className="text-xl font-bold text-slate-800">
                  {report?.totalCount}
                </p>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex-1 bg-white rounded-2xl border-l-4 border-green-500 shadow-sm p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <IndianRupee size={20} className="text-green-600" />
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--gray-color)" }}
                >
                  Total Amount
                </p>
                <p className="text-xl font-extrabold text-green-600">
                  {formatINR(totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* ── Worker Card ── */}
          <WorkerReportCard
            workerName={firstItem?.workerName ?? "N/A"}
            workerCategoryName={firstItem?.workerCategoryName ?? "N/A"}
            onPress={() =>
              firstItem?.workerId && handleWorkerOpen(firstItem.workerId)
            }
          />
          {/* ── Records ── */}
          <p className="text-lg font-semibold " >Records :</p>

          {report?.items.map((item, index) => (
            <RecordCard
              key={item.attendanceId}
              date={item.date}
              siteName={item.siteName}
              amount={item.amount}
              isFirst={index === 0}
              onPress={() => handleAttendanceOpen(item.attendanceId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
