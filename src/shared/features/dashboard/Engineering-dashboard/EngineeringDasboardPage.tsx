import { useState, useMemo, memo } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
import { SitesUrls } from "@/shared/features/sites/utils/urls";
import { useEngineerDashboard } from "./useEngineeringDashboard";
import type { RecentPurchase } from "./useEngineeringDashboard";
import type { Task } from "@/shared/features/task/DTOs/TaskProps";
import type { Site } from "@/shared/features/sites/DTOs/SiteProps";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

// ── Shared components ─────────────────────────────────────────────────────────
import DashboardStatCard from "@/shared/components/DashboardStatCard/DashboardStatCard";
import SectionHeader from "@/shared/components/SectionHeader/SectionHeader";
import StatusFilterChips from "@/shared/components/StatusFilterChips/StatusFilterChips";
import {
  BuildingIcon,
  WorkersIcon,
  WalletIcon,
  TasksIcon,
  AttendanceIcon,
  NewTaskIcon,
  BagIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@/shared/components/DashboardIcons/DashboardIcons";

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_DOT_COLORS: Record<string, string> = {
  Working: "#1D9E75",
  Completed: "#185FA5",
  Hold: "#A32D2D",
  "Yet to start": "#BA7517",
};

const STATUS_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  Working: { bg: "#dcfce7", text: "#15803d" },
  Completed: { bg: "#dbeafe", text: "#1d4ed8" },
  "Yet to start": { bg: "#fef9c3", text: "#854d0e" },
  Hold: { bg: "#fee2e2", text: "#991b1b" },
};

// ── Inline row components ─────────────────────────────────────────────────────

const TaskRow = memo(
  ({
    task,
    urgent,
    onPress,
  }: {
    task: Task;
    urgent: boolean;
    onPress: () => void;
  }) => {
    const { t } = useLanguage();

    return (
      <button
        onClick={onPress}
        className={`w-full flex items-center px-4 py-3 border-b border-gray-100 last:border-b-0 text-left hover:bg-gray-50 transition-colors ${urgent ? "bg-red-50 hover:bg-red-50/80" : ""}`}
      >
        <span className="w-2 h-2 rounded-full bg-red-500 mr-3 shrink-0" />
        <span className="flex-1 min-w-0">
          <p
            className="truncate font-semibold text-gray-900"
            style={{ fontSize: "var(--font-sm)" }}
          >
            {task.taskName}
          </p>
          <p
            className="mt-0.5 text-gray-400"
            style={{ fontSize: "var(--font-xs)" }}
          >
            {task.site?.name ?? ""}
          </p>
        </span>
        <span
          className="px-2.5 py-0.5 rounded-full font-semibold ml-2 shrink-0"
          style={{
            fontSize: "var(--font-xs)",
            backgroundColor: urgent ? "#fce7f3" : "#fff7ed",
            color: urgent ? "#9d174d" : "#c2410c",
          }}
        >
          {urgent ? t("Urgent") : task.priority}
        </span>
        <ChevronRightIcon className="ml-2" />
      </button>
    );
  },
  (prev, next) =>
    prev.task.id === next.task.id &&
    prev.task.taskName === next.task.taskName &&
    prev.task.priority === next.task.priority &&
    prev.task.site?.name === next.task.site?.name &&
    prev.urgent === next.urgent,
);

const SiteRow = ({ site, onClick }: { site: Site; onClick: () => void }) => {
  const { t } = useLanguage();
  const badge = STATUS_BADGE_COLORS[site.status] ?? {
    bg: "#f3f4f6",
    text: "#374151",
  };
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center py-3 text-left hover:bg-gray-50 transition-colors rounded-lg"
    >
      <span
        className="w-2 h-2 rounded-full mr-3 shrink-0"
        style={{ backgroundColor: STATUS_DOT_COLORS[site.status] ?? "#888" }}
      />
      <span className="flex-1 min-w-0 flex items-center gap-2">
        <span
          className="font-semibold text-gray-900 truncate"
          style={{ fontSize: "var(--font-sm)" }}
        >
          {site.name}
        </span>
        <span
          className="inline-flex px-2 py-0.5 rounded-full font-semibold shrink-0"
          style={{
            fontSize: "var(--font-xs)",
            backgroundColor: badge.bg,
            color: badge.text,
          }}
        >
          {site.status}
        </span>
      </span>
      <ChevronRightIcon className="ml-2 shrink-0" />
    </button>
  );
};

const PurchaseRow = ({
  purchase: p,
  onClick,
}: {
  purchase: RecentPurchase;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center py-3.5 text-left hover:bg-gray-50 transition-colors rounded-lg"
  >
    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0 mr-3.5 text-green-600">
      <BagIcon />
    </div>
    <span className="flex-1 min-w-0">
      <p
        className="font-semibold text-gray-900 truncate"
        style={{ fontSize: "var(--font-sm)" }}
      >
        {p.supplier?.name ?? "—"}
      </p>
      <p
        className="text-gray-400 mt-0.5"
        style={{ fontSize: "var(--font-xs)" }}
      >
        {p.site?.name ?? ""}
        {p.date ? ` · ${p.date}` : ""}
      </p>
    </span>
    <span className="flex items-center gap-1 shrink-0 ml-2">
      <span
        className="font-bold text-blue-700"
        style={{ fontSize: "var(--font-sm)" }}
      >
        ₹{parseFloat(String(p.totalAmount ?? 0)).toLocaleString()}
      </span>
      <ChevronRightIcon />
    </span>
  </button>
);

// ── Main component ────────────────────────────────────────────────────────────

const EngineerDashboard = () => {
  const { t } = useLanguage();
  const user = AuthHelper.getUserProfile();
  const navigate = useNavigate();
  const [siteFilter, setSiteFilter] = useState("All");

  const {
    sites,
    chartData,
    stats,
    urgentTasks,
    openTasks,
    recentPurchases,
    loading,
    error,
    retryFetch,
    navigateAttendance,
    navigateNewTask,
    navigateToSites,
    navigateToAttendanceList,
    navigateToTaskList,
    navigateToTask,
    navigateToPurchaseList,
    navigateToPurchase,
  } = useEngineerDashboard();

  const filteredSites = useMemo(
    () =>
      siteFilter === "All"
        ? sites
        : sites.filter((s) => s.status === siteFilter),
    [sites, siteFilter],
  );

  if (loading) {
    return (
      <div className="flex flex-1 h-screen items-center justify-center bg-[#f8f9fb]">
        <div
          className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{
            borderColor: "var(--primary) transparent transparent transparent",
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 h-screen flex-col items-center justify-center gap-4 bg-[#f8f9fb] px-6 text-center">
        <svg
          className="w-14 h-14 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
        <p className="text-gray-700" style={{ fontSize: "var(--font-sm)" }}>
          {t("Something went wrong")}
        </p>
        <button
          onClick={retryFetch}
          className="px-7 py-2.5 rounded-xl font-bold text-white"
          style={{
            backgroundColor: "var(--primary)",
            fontSize: "var(--font-sm)",
          }}
        >
          {t("Retry")}
        </button>
      </div>
    );
  }

  const greetingName = user?.name?.split(" ")[0] ?? "";

  const statCards = [
    {
      icon: <BuildingIcon />,
      value: stats.activeSiteCount,
      label: t("Active Sites"),
      bg: "#dbeafe",
      color: "#1d4ed8",
      onClick: () => navigateToSites("Working"),
    },
    {
      icon: <WorkersIcon />,
      value: stats.workersToday,
      label: t("Workers Today"),
      bg: "#ffedd5",
      color: "#c2410c",
      onClick: navigateToAttendanceList,
    },
    {
      icon: <WalletIcon />,
      value: `₹${Math.round(stats.wagesToday).toLocaleString()}`,
      label: t("Wages Today"),
      bg: "#dcfce7",
      color: "#15803d",
      onClick: undefined,
    },
    {
      icon: <TasksIcon />,
      value: stats.openTaskCount,
      label: t("Open Tasks"),
      bg: "#fce7f3",
      color: "#9d174d",
      onClick: navigateToTaskList,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fb]">
      {/* Header */}
      <div
        className="px-4 md:px-6 py-4"
        style={{ backgroundColor: "var(--primary)" }}
      >
        <p
          className="font-semibold text-black"
          style={{ fontSize: "var(--font-md)" }}
        >
          {t("Welcome")}, {greetingName} 👋
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* ══ TODAY AT A GLANCE ══ */}
        <section>
          <p
            className="font-bold text-gray-500 uppercase tracking-widest mb-3"
            style={{ fontSize: "var(--font-xs)" }}
          >
            {t("Today at a Glance")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {statCards.map((card, i) => (
              <DashboardStatCard key={i} {...card} />
            ))}
          </div>
        </section>

        {/* ══ MIDDLE ROW: Site Status | Quick Actions | Urgent Tasks ══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Site Status Overview */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p
                className="font-bold text-gray-500 uppercase tracking-widest"
                style={{ fontSize: "var(--font-xs)" }}
              >
                {t("Site Status Overview")}
              </p>
              <button
                onClick={() => navigateToSites()}
                className="text-gray-400 hover:text-gray-600"
              >
                <ExternalLinkIcon />
              </button>
            </div>
            {chartData.length > 0 ? (
              <div className="flex flex-col items-center md:flex-row gap-4">
                <div className="relative shrink-0">
                  <PieChart width={140} height={140}>
                    <Pie
                      data={chartData}
                      cx={65}
                      cy={65}
                      innerRadius={44}
                      outerRadius={65}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#fff"
                      isAnimationActive
                    >
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, n]} />
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p
                      className="text-gray-400"
                      style={{ fontSize: "var(--font-xs)" }}
                    >
                      {t("Total")}
                    </p>
                    <p
                      className="font-extrabold text-gray-900"
                      style={{ fontSize: "var(--font-xl)" }}
                    >
                      {sites.length}
                    </p>
                  </div>
                </div>
                <ul className="flex flex-col gap-2.5 w-full">
                  {chartData.map((item, i) => (
                    <li key={i}>
                      <button
                        onClick={() => navigateToSites(item.text)}
                        className="flex items-center gap-2.5 w-full text-left hover:opacity-80 transition-opacity"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span
                          className="text-gray-600 flex-1"
                          style={{ fontSize: "var(--font-sm)" }}
                        >
                          {t(item.text)}{" "}
                        </span>
                        <span
                          className="font-bold text-gray-800"
                          style={{ fontSize: "var(--font-sm)" }}
                        >
                          {item.value}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div
                className="flex items-center justify-center h-32 text-gray-400"
                style={{ fontSize: "var(--font-sm)" }}
              >
                No site data
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm">
            <p
              className="font-bold text-gray-500 uppercase tracking-widest mb-4"
              style={{ fontSize: "var(--font-xs)" }}
            >
              {t("Quick Actions")}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={navigateAttendance}
                className="rounded-xl p-3.5 flex items-center gap-3 hover:opacity-90 transition-opacity text-left"
                style={{ backgroundColor: "#dbeafe" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#1d4ed820", color: "#1d4ed8" }}
                >
                  <AttendanceIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold text-blue-800"
                    style={{ fontSize: "var(--font-sm)" }}
                  >
                    {t("Mark Attendance")}
                  </p>
                  <p
                    className="text-blue-600 mt-0.5"
                    style={{ fontSize: "var(--font-xs)" }}
                  >
                    Mark worker attendance
                  </p>
                </div>
                <span className="text-blue-500 shrink-0">
                  <ArrowRightIcon />
                </span>
              </button>

              <button
                onClick={navigateNewTask}
                className="rounded-xl p-3.5 flex items-center gap-3 hover:opacity-90 transition-opacity text-left"
                style={{ backgroundColor: "#f3e8ff" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#7e22ce20", color: "#7e22ce" }}
                >
                  <NewTaskIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold text-purple-800"
                    style={{ fontSize: "var(--font-sm)" }}
                  >
                    {t("New Task")}
                  </p>
                  <p
                    className="text-purple-600 mt-0.5"
                    style={{ fontSize: "var(--font-xs)" }}
                  >
                    {t("Create a new task")}
                  </p>
                </div>
                <span className="text-purple-500 shrink-0">
                  <ArrowRightIcon />
                </span>
              </button>
            </div>
          </div>

          {/* Urgent Tasks */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm">
            <SectionHeader
              title={`⚠ ${t("Urgent Tasks")}`}
              urgentCount={urgentTasks.length}
              onLink={urgentTasks.length > 0 ? navigateToTaskList : undefined}
            />
            {urgentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <CheckIcon />
                </div>
                <p
                  className="text-gray-400"
                  style={{ fontSize: "var(--font-sm)" }}
                >
                  {t("No urgent tasks")}
                </p>
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden border border-gray-100">
                {urgentTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    urgent
                    onPress={() => navigateToTask(task.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══ BOTTOM ROW: Sites | Recent Purchases ══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sites */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm">
            <SectionHeader
              title={t("Sites")}
              onLink={() => navigateToSites()}
            />
            <StatusFilterChips value={siteFilter} onChange={setSiteFilter} />
            <div className="divide-y divide-gray-100">
              {filteredSites.length === 0 ? (
                <p
                  className="text-gray-400 text-center py-6"
                  style={{ fontSize: "var(--font-sm)" }}
                >
                  {t("No sites found")}
                </p>
              ) : (
                filteredSites
                  .slice(0, 5)
                  .map((site) => (
                    <SiteRow
                      key={site.id}
                      site={site}
                      onClick={() => navigate(SitesUrls.edit(site.id))}
                    />
                  ))
              )}
            </div>
            {filteredSites.length > 5 && (
              <button
                onClick={() =>
                  navigateToSites(siteFilter === "All" ? undefined : siteFilter)
                }
                className="w-full mt-2 py-2 text-center font-semibold text-blue-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ fontSize: "var(--font-xs)" }}
              >
                +{filteredSites.length - 5} {t("more")} →
              </button>
            )}
          </div>

          {/* Recent Purchases */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm">
            <SectionHeader
              title={t("Recent Purchases")}
              onLink={navigateToPurchaseList}
            />
            {recentPurchases.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2 text-gray-400">
                  <BagIcon />
                </div>
                <p
                  className="text-gray-400"
                  style={{ fontSize: "var(--font-sm)" }}
                >
                  No recent purchases
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentPurchases.map((p) => (
                  <PurchaseRow
                    key={p.id}
                    purchase={p}
                    onClick={() => navigateToPurchase(p.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══ OPEN TASKS ══ */}
        {openTasks.length > 0 && (
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm">
            <SectionHeader
              title={`${t("Open Tasks")} (${openTasks.length})`}
              onLink={navigateToTaskList}
            />
            <div className="rounded-xl overflow-hidden border border-gray-100">
              {openTasks.slice(0, 5).map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  urgent={false}
                  onPress={() => navigateToTask(task.id)}
                />
              ))}
            </div>
            {openTasks.length > 5 && (
              <button
                onClick={navigateToTaskList}
                className="w-full mt-3 py-2 text-center font-semibold text-blue-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ fontSize: "var(--font-xs)" }}
              >
                +{openTasks.length - 5} {t("more")} →
              </button>
            )}
          </div>
        )}

        {/* ══ WEEK WAGES BANNER ══ */}
        {stats.wagesWeek > 0 && (
          <div className="bg-[#e0f2fe] rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
            <p
              className="font-semibold text-[#0369a1]"
              style={{ fontSize: "var(--font-sm)" }}
            >
              {t("This Week's Total Wages")}
            </p>
            <p
              className="font-extrabold text-[#0369a1]"
              style={{ fontSize: "var(--font-lg)" }}
            >
              ₹{Math.round(stats.wagesWeek).toLocaleString()}
            </p>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
};

export default EngineerDashboard;
