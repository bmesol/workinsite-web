import { RefreshCw, MapPin, Loader2, CheckCircle2, LogOut, ChevronRight } from 'lucide-react';
import { useSupervisorDashboard, type AttendanceItem, type Task, type SupervisorAttendance } from './useSupervisorDasboard';
import { useNavigate } from 'react-router-dom';
import StatCard from '@/shared/components/StatCard/StatCard';

const SectionTitle = ({ children, onViewAll }: { children: React.ReactNode; onViewAll?: () => void }) => (
  <div className="flex items-center justify-between mb-3">
    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{children}</p>
    {onViewAll && (
      <button onClick={onViewAll} className="text-xs font-semibold" style={{ color: '#1d4ed8' }}>
        View all →
      </button>
    )}
  </div>
);

const ListCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
    {children}
  </div>
);

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    checkIn,
    mySite,
    todayWorkers,
    myTasks,
    weekHistory,
    stats,
    loading,
    checkingIn,
    refreshing,
    handleCheckIn,
    handleCheckOut,
    handleRefresh,
  } = useSupervisorDashboard();

  const greetingName = userProfile?.name?.split(' ')[0] ?? '';
  const isCheckedIn = checkIn !== null;

  const navigateToAttendanceList = () => navigate('/attendance');
  const navigateToTaskList = () => navigate('/task');
  const navigateToTask = (id: number) => navigate(`/task/${id}`);
  const navigateToSite = (id: number) => navigate(`/sites/${id}`);
  const navigateAttendance = () => navigate('/attendance/create');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ background: '#f8f9fb' }}>

      {/* ── Header ── */}
      <div
        className="w-full px-6 py-5 flex items-center justify-between"
        style={{ background: 'var(--primary)' }}
      >
        <div>
          <p className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>
            Good morning, {greetingName} 👋
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--primary-foreground)', opacity: 0.8 }}>
            Supervisor Dashboard
          </p>
        </div>
        {/* <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-full"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
            style={{ color: 'var(--primary-foreground)' }}
          />
        </button> */}
      </div>

      {/* ── Content ── */}
      <div className="w-full px-6 py-5 space-y-5">

        {/* ── Row 1: Check In / Out — full width ── */}
        <div className="w-full">
          {isCheckedIn ? (
            <div className="space-y-3">
              <div
                className="w-full rounded-xl p-4"
                style={{ background: '#dcfce7', border: '1px solid #86efac' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-green-700">Currently Checked In</span>
                </div>
                <p className="text-sm text-gray-700">
                  {mySite?.name ?? 'Site'} · {checkIn?.date}
                </p>
                {checkIn?.currentLocation?.address && (
                  <div className="flex items-start gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-500 leading-tight">
                      {checkIn.currentLocation.address}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={handleCheckOut}
                className="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: '#ef4444', color: '#fff' }}
              >
                <LogOut className="w-4 h-4" />
                Check Out
              </button>
            </div>
          ) : (
            <button
              onClick={handleCheckIn}
              disabled={checkingIn}
              className="w-full py-5 rounded-xl flex flex-col items-center justify-center gap-1 transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              {checkingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="text-base font-bold">✅ Check In to Site</span>
                  <span className="text-xs opacity-80">Tap to record location & start shift</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* ── Row 2: Today's Summary — StatCard ── */}
        <div>
          <SectionTitle>Today's Summary</SectionTitle>
          <div className="flex gap-3">
            {/* ✅ StatCard component use பண்றோம் */}
            <StatCard
              value={stats.present}
              label="Workers Present"
              bgColor="#dcfce7"
              textColor="#15803d"
              onClick={navigateToAttendanceList}
            />
            <StatCard
              value={stats.myTaskCount}
              label="My Tasks"
              bgColor="#dbeafe"
              textColor="#1d4ed8"
              onClick={navigateToTaskList}
            />
          </div>
        </div>

        {/* ── Row 3: Site + Week — 2 column grid ── */}
        <div className="grid grid-cols-2 gap-3">

          {/* My Assigned Site */}
          <div
            className="rounded-xl p-4 flex flex-col gap-2 cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            onClick={() => mySite && navigateToSite(mySite.id)}
          >
            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
              My Site
            </span>
            {mySite ? (
              <>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: mySite.status === 'Working' ? '#22c55e' : '#f59e0b' }}
                  />
                  <span className="text-sm font-bold truncate" style={{ color: 'var(--foreground)' }}>
                    {mySite.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{mySite.status}</span>
              </>
            ) : (
              <span className="text-sm text-gray-400">No site assigned</span>
            )}
          </div>

          {/* This Week */}
          <div
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
              This Week
            </span>
            <span className="text-2xl font-extrabold" style={{ color: 'var(--foreground)' }}>
              {weekHistory.length}
            </span>
            <span className="text-xs text-gray-400">Days attended</span>
          </div>
        </div>

        {/* ── Mark Worker Attendance ── */}
        {isCheckedIn && (
          <button
            onClick={navigateAttendance}
            className="w-full py-4 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
            style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }}
          >
            + Mark Worker Attendance
          </button>
        )}

        {/* ── Workers Today ── */}
        {todayWorkers.length > 0 && (
          <div>
            <SectionTitle onViewAll={navigateToAttendanceList}>
              Workers — Today ({todayWorkers.length})
            </SectionTitle>
            <ListCard>
              {todayWorkers.slice(0, 8).map((w: AttendanceItem) => (
                <div
                  key={w.id}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                      {w.worker?.name ?? '—'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {w.workType?.name ?? ''} · {w.wageType?.name ?? ''}
                    </p>
                  </div>
                </div>
              ))}
              {todayWorkers.length > 8 && (
                <button
                  onClick={navigateToAttendanceList}
                  className="w-full py-3 flex items-center justify-center gap-1 text-xs font-semibold text-blue-600"
                  style={{ background: 'var(--muted)' }}
                >
                  +{todayWorkers.length - 8} more <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </ListCard>
          </div>
        )}

        {/* ── My Tasks ── */}
        {myTasks.length > 0 && (
          <div>
            <SectionTitle onViewAll={navigateToTaskList}>
              My Tasks ({myTasks.length})
            </SectionTitle>
            <ListCard>
              {myTasks.map((task: Task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onClick={() => navigateToTask(task.id)}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: task.priority === 'Urgent' ? '#ef4444' : '#3b82f6' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                      {task.taskName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{task.site?.name ?? ''}</p>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: task.priority === 'Urgent' ? '#fce7f3' : '#dbeafe',
                      color: task.priority === 'Urgent' ? '#9d174d' : '#1d4ed8',
                    }}
                  >
                    {task.priority}
                  </span>
                  <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                </div>
              ))}
            </ListCard>
          </div>
        )}

        {/* ── Week History ── */}
        {weekHistory.length > 0 && (
          <div>
            <SectionTitle>My Attendance — This Week</SectionTitle>
            <ListCard>
              {weekHistory.map((entry: SupervisorAttendance) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <p className="text-sm" style={{ color: 'var(--foreground)' }}>{entry.date}</p>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
              ))}
            </ListCard>
          </div>
        )}

        <div className="h-6" />
      </div>
    </div>
  );
};

export default SupervisorDashboard;