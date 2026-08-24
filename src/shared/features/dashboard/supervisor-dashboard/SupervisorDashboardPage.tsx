import { MapPin, Loader2, CheckCircle2, LogOut, ChevronRight, Users, ClipboardList, CalendarDays, X } from 'lucide-react';
import { useSupervisorDashboard, type AttendanceItem, type Task, type SupervisorAttendance, type Site } from './useSupervisorDashboard';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';

// ── Section Title ──────────────────────────────────────────────────────────────
const SectionTitle = ({
  children,
  onViewAll,
}: {
  children: React.ReactNode;
  onViewAll?: () => void;
}) => (
  <div className="flex items-center justify-between mb-3">
    <p style={{ fontSize: 'var(--font-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280' }}>
      {children}
    </p>
    {onViewAll && (
      <button onClick={onViewAll} style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: '#1d4ed8' }}>
        View all →
      </button>
    )}
  </div>
);

// ── List Card ─────────────────────────────────────────────────────────────────
const ListCard = ({ children }: { children: React.ReactNode }) => (
  <div style={{ borderRadius: '1rem', overflow: 'hidden', background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
    {children}
  </div>
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({
  value,
  label,
  icon,
  bgColor,
  iconBg,
  textColor,
  onClick,
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  textColor: string;
  onClick?: () => void;
}) => (
  <div
    className="flex-1 flex items-center gap-3 cursor-pointer"
    style={{ background: bgColor, borderRadius: '1rem', padding: '1rem' }}
    onClick={onClick}
  >
    <div
      className="flex-shrink-0 flex items-center justify-center"
      style={{ width: 48, height: 48, borderRadius: '50%', background: iconBg }}
    >
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '1.5rem', fontWeight: 800, color: textColor, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 'var(--font-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: textColor, marginTop: 2 }}>
        {label}
      </p>
    </div>
  </div>
);

// ── Site Status Dot ──────────────────────────────────────────────────────────
const SiteDot = ({ status }: { status: string }) => (
  <div
    className="w-3 h-3 rounded-full flex-shrink-0"
    style={{ background: status === 'Working' ? '#22c55e' : '#f59e0b' }}
  />
);

// ── Main Component ────────────────────────────────────────────────────────────
const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const {
    userProfile,
    todayCheckIns,
    mySite,
    availableSites,
    showSitePicker,
    todayWorkers,
    myTasks,
    weekHistory,
    stats,
    loading,
    checkingIn,
    handleCheckIn,
    closeSitePicker,
    handleSiteSelected,
    handleCheckOut,
  } = useSupervisorDashboard();

  const greetingName = userProfile?.name?.split(' ')[0] ?? '';
  const isCheckedIn = todayCheckIns.length > 0;

  const navigateToAttendanceList = () => navigate('/attendance');
  const navigateToTaskList = () => navigate('/task');
  const navigateToTask = (id: number) => navigate(`/task/${id}/edit`);
  const navigateToSite = (id: number) => navigate(`/sites/${id}/edit`);
  const navigateAttendance = () => navigate('/attendance/create');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--background)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--background)' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="px-4 md:px-6 py-4" style={{ background: 'var(--primary)' }}>
        <p style={{ fontSize: 'var(--font-md)', fontWeight: 600, color: 'var(--primary-foreground)' }}>
          {t('Welcome')}, {greetingName} 👋
        </p>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="w-full space-y-5" style={{ padding: '1.25rem 1rem' }}>

        {/* ── Today's Check-ins (multi-site list) ─────────────────────── */}
        {isCheckedIn && (
          <div>
            <SectionTitle>{t("Today's Check-ins")}</SectionTitle>
            <div className="space-y-2">
              {todayCheckIns.map((ci: SupervisorAttendance, index: number) => {
                const isLast = index === todayCheckIns.length - 1;
                return (
                  <div
                    key={ci.id}
                    className="flex items-center justify-between"
                    style={{ borderRadius: '1rem', padding: '1rem', background: '#dcfce7', border: '1px solid #86efac' }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#16a34a' }} />
                        <span className="truncate" style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: '#15803d' }}>
                          {ci.site?.name ?? 'Site'}
                        </span>
                      </div>
                      <p style={{ fontSize: 'var(--font-xs)', color: '#374151' }}>
  {ci.date}{ci.time ? `  ·  ${ci.time}` : ''}
</p>
                      {ci.currentLocation?.address && (
                        <div className="flex items-start gap-1 mt-1">
                          <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                          <p className="truncate" style={{ fontSize: 'var(--font-xs)', color: '#6b7280', lineHeight: 1.4 }}>
                            {ci.currentLocation.address}
                          </p>
                        </div>
                      )}
                    </div>
                    {isLast && (
                      <button
                        onClick={() => handleCheckOut(ci)}
                        className="flex-shrink-0 ml-3"
                        aria-label={t('Check Out')}
                      >
                        <LogOut className="w-5 h-5" style={{ color: '#ef4444' }} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Check In button — shown while there are unvisited assigned sites ── */}
        {availableSites.length > 0 && (
          <button
            onClick={handleCheckIn}
            disabled={checkingIn}
            className="w-full flex items-center gap-4"
            style={{ borderRadius: '1rem', padding: '1.25rem', background: 'var(--primary-side)', border: '1px solid #FDE68A', opacity: checkingIn ? 0.6 : 1 }}
          >
            {checkingIn ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto" style={{ color: 'var(--secondary)' }} />
            ) : (
              <>
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ width: 48, height: 48, borderRadius: '0.75rem', background: 'var(--card)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2.5}>
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                    <path d="M9 16l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-left">
                  <p style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--foreground)' }}>
                    {isCheckedIn ? t('Check In to Another Site') : t('Check In to Site')}
                  </p>
                  <p style={{ fontSize: 'var(--font-xs)', color: '#6b7280', marginTop: 2 }}>
                    {t('Tap to record location & start shift')}
                  </p>
                </div>
              </>
            )}
          </button>
        )}

        {/* ── Today's Summary ─────────────────────────────────────────── */}
        <div>
          <SectionTitle>{t("Today's Summary")}</SectionTitle>
          <div className="flex gap-3">
            <StatCard
              value={stats.present}
              label="Workers Present"
              bgColor="#DCFCE7"
              iconBg="#BBF7D0"
              textColor="#15803D"
              icon={<Users className="w-5 h-5" style={{ color: '#16a34a' }} />}
              onClick={navigateToAttendanceList}
            />
            <StatCard
              value={stats.myTaskCount}
              label="My Tasks"
              bgColor="#DBEAFE"
              iconBg="#BFDBFE"
              textColor="#1D4ED8"
              icon={<ClipboardList className="w-5 h-5" style={{ color: '#2563eb' }} />}
              onClick={navigateToTaskList}
            />
          </div>
        </div>

        {/* ── My Site + This Week ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">

          {/* My Site */}
          <div
            className="flex flex-col gap-2 cursor-pointer"
            style={{ borderRadius: '1rem', padding: '1rem', background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            onClick={() => mySite && navigateToSite(mySite.id)}
          >
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280' }}>
              My Site
            </span>
            {mySite ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <SiteDot status={mySite.status} />
                  <span style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--foreground)' }} className="truncate">
                    {mySite.name}
                  </span>
                </div>
                <span style={{ fontSize: 'var(--font-xs)', color: '#9ca3af' }}>{mySite.status}</span>
              </div>
            ) : (
              <span style={{ fontSize: 'var(--font-sm)', color: '#9ca3af' }}>No site assigned</span>
            )}
          </div>

          {/* This Week */}
          <div
            className="flex flex-col gap-2"
            style={{ borderRadius: '1rem', padding: '1rem', background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280' }}>
              This Week
            </span>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', background: '#dbeafe' }}>
                <CalendarDays className="w-5 h-5" style={{ color: '#2563eb' }} />
              </div>
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', lineHeight: 1 }}>{weekHistory.length}</p>
                <p style={{ fontSize: 'var(--font-xs)', color: '#9ca3af', marginTop: 2 }}>Days attended</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mark Worker Attendance ──────────────────────────────────── */}
        {isCheckedIn && (
          <button
            onClick={navigateAttendance}
            className="w-full"
            style={{ borderRadius: '1rem', padding: '1rem', background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', fontSize: 'var(--font-sm)', fontWeight: 700 }}
          >
            + Mark Worker Attendance
          </button>
        )}

        {/* ── Workers Today ───────────────────────────────────────────── */}
        {todayWorkers.length > 0 && (
          <div>
            <SectionTitle onViewAll={navigateToAttendanceList}>
              Workers — Today ({todayWorkers.length})
            </SectionTitle>
            <ListCard>
              {todayWorkers.slice(0, 8).map((w: AttendanceItem, idx: number) => (
                <div
                  key={w.id}
                  className="flex items-center gap-3"
                  style={{ padding: '0.75rem 1rem', borderBottom: idx < Math.min(todayWorkers.length, 8) - 1 ? '1px solid var(--border)' : undefined }}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#22c55e' }} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate" style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--foreground)' }}>
                      {w.worker?.name ?? '—'}
                    </p>
                    <p style={{ fontSize: 'var(--font-xs)', color: '#9ca3af', marginTop: 2 }}>
                      {w.workType?.name ?? ''} · {w.wageType?.name ?? ''}
                    </p>
                  </div>
                </div>
              ))}
              {todayWorkers.length > 8 && (
                <button
                  onClick={navigateToAttendanceList}
                  className="w-full flex items-center justify-center gap-1"
                  style={{ padding: '0.75rem', background: 'var(--background)', fontSize: 'var(--font-xs)', fontWeight: 600, color: '#2563eb' }}
                >
                  +{todayWorkers.length - 8} more <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </ListCard>
          </div>
        )}

        {/* ── My Tasks ────────────────────────────────────────────────── */}
        {myTasks.length > 0 && (
          <div>
            <SectionTitle onViewAll={navigateToTaskList}>
              My Tasks ({myTasks.length})
            </SectionTitle>
            <ListCard>
              {myTasks.map((task: Task, idx: number) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 cursor-pointer"
                  style={{ padding: '0.75rem 1rem', borderBottom: idx < myTasks.length - 1 ? '1px solid var(--border)' : undefined }}
                  onClick={() => navigateToTask(task.id)}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: task.priority === 'Urgent' ? '#ef4444' : '#3b82f6' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate" style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--foreground)' }}>
                      {task.taskName}
                    </p>
                    <p style={{ fontSize: 'var(--font-xs)', color: '#9ca3af', marginTop: 2 }}>{task.site?.name ?? ''}</p>
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--font-xs)',
                      fontWeight: 700,
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      flexShrink: 0,
                      background: task.priority === 'Urgent' ? '#fce7f3' : '#dbeafe',
                      color: task.priority === 'Urgent' ? '#9d174d' : '#1d4ed8',
                    }}
                  >
                    {task.priority}
                  </span>
                  <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#9ca3af' }} />
                </div>
              ))}
            </ListCard>
          </div>
        )}

        {/* ── Week History ─────────────────────────────────────────────── */}
        {weekHistory.length > 0 && (
          <div>
            <SectionTitle>My Attendance — This Week</SectionTitle>
            <ListCard>
              {weekHistory.map((entry: SupervisorAttendance, idx: number) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between"
                  style={{ padding: '0.75rem 1rem', borderBottom: idx < weekHistory.length - 1 ? '1px solid var(--border)' : undefined }}
                >
                  <p style={{ fontSize: 'var(--font-sm)', color: 'var(--foreground)' }}>{entry.date}</p>
                  <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
                </div>
              ))}
            </ListCard>
          </div>
        )}

        <div style={{ height: 24 }} />
      </div>

      {/* ── Site Picker Dialog ───────────────────────────────────────── */}
      {/* Dialog stays open (showing a spinner) while checkingIn is true, and
          only closes once handleSiteSelected finishes — this avoids the
          dialog-close animation overlapping with the page's layout shift. */}
      <Dialog
        open={showSitePicker}
        onOpenChange={(v) => {
          if (!v && !checkingIn) closeSitePicker();
        }}
      >
        <DialogContent className="max-h-[65vh] overflow-y-auto rounded-2xl sm:max-w-md">
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--foreground)' }}>
              {t('Select Site to Check In')}
            </p>
            {!checkingIn && (
              <button onClick={closeSitePicker} aria-label={t('Close')}>
                <X className="w-5 h-5" style={{ color: '#6b7280' }} />
              </button>
            )}
          </div>

          {checkingIn ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary)' }} />
              <p style={{ fontSize: 'var(--font-sm)', color: '#6b7280' }}>{t('Recording your location…')}</p>
            </div>
          ) : availableSites.length === 0 ? (
            <p className="text-center py-6" style={{ color: '#9ca3af', fontSize: 'var(--font-sm)' }}>
              {t('No available sites')}
            </p>
          ) : (
            <div>
              {availableSites.map((site: Site, idx: number) => (
                <div
                  key={site.id}
                  onClick={() => handleSiteSelected(site)}
                  className="flex items-center gap-3 cursor-pointer"
                  style={{ padding: '0.9rem 0.25rem', borderBottom: idx < availableSites.length - 1 ? '1px solid var(--border)' : undefined }}
                >
                  <SiteDot status={site.status} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate" style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--foreground)' }}>
                      {site.name}
                    </p>
                    <p style={{ fontSize: 'var(--font-xs)', color: '#9ca3af', marginTop: 2 }}>{site.status}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#9ca3af' }} />
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupervisorDashboard;