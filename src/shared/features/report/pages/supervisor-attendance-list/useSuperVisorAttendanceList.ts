import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupervisorAttendanceService } from '../../service/SupervisorAttendanceService';
import { useUserService } from '@/shared/features/users/services/UserService';
import { formatStringToDate, getWeekRange } from '@/shared/features/attendance/utils/functions';
import type { SupervisorAttendance } from '../../DTOs/SupervisorAttendanceProps';
import { useSupervisorAttendanceInputValidate } from '../../components/InputValidate/SupervisorAttendanceInputValidate';

const PAGE_SIZE = 10;

export function useSupervisorAttendanceList() {
  const navigate = useNavigate();

  const supervisorAttendanceService = useSupervisorAttendanceService();
  const userService = useUserService();

  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [attendances, setAttendances] = useState<SupervisorAttendance[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasSearchFilter, setHasSearchFilter] = useState(false);
  const [supervisor, setSupervisor] = useState({ name: '', value: '' });
  const [supervisorList, setSupervisorList] = useState<any[]>([]);
  const [appliedFilters, setAppliedFilters] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState <
    'lastWeek' | 'currentWeek' | 'custom'
  >('currentWeek');
  const [dateRange, setDateRange] = useState(getWeekRange('currentWeek'));

  const { validate, error, initialError, setError } =
    useSupervisorAttendanceInputValidate({
      fromDate: formatStringToDate(dateRange.from),
      toDate: formatStringToDate(dateRange.to),
    });

  const isFiltered = useMemo(
    () => supervisor.value || dateRange.from || dateRange.to,
    [supervisor, dateRange],
  );

  const fetchAttendances = async (reset = false, override?: any) => {
    if (!reset && !hasMore) return;
    reset ? setLoading(true) : setPaginationLoading(true);

    try {
      const overrideObj = override ?? {};
      const filters = {
        SupervisorId:
          'SupervisorId' in overrideObj
            ? overrideObj.SupervisorId
            : supervisor.value ? Number(supervisor.value) : undefined,
        FromDate: 'FromDate' in overrideObj ? overrideObj.FromDate : dateRange.from,
        ToDate: 'ToDate' in overrideObj ? overrideObj.ToDate : dateRange.to,
        PageNumber: reset ? 1 : pageNumber,
        PageSize: PAGE_SIZE,
      };

      const response = await supervisorAttendanceService.getSupervisorAttendances(filters);
      const items = response.items ?? [];

      if (reset) {
        setAttendances(items);
        setPageNumber(2);
      } else {
        setAttendances(prev => [...prev, ...items]);
        setPageNumber(n => n + 1);
      }

      setHasMore(response.totalPages > response.pageNumber);
      setHasSearchFilter(Boolean(isFiltered));
    } catch (err) {
      console.log('Fetch error:', err);
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const fetchSupervisors = async (text = '') => {
    if (!text) return;
    try {
      const res = await userService.getUsers(text);
      setSupervisorList(res?.slice(0, 3) || []);
    } catch (err) {
      console.log('Fetch supervisors error:', err);
    }
  };

  const supervisorDetails = supervisorList.map(item => ({
    label: `${item.name} [${item.role?.name ?? ''}]`,
    value: item.id.toString(),
    allItems: { value: item.id.toString(), name: item.name },
  }));

  const handleClearSearch = () => {
    const week = getWeekRange('currentWeek');
    setSupervisor({ name: '', value: '' });
    setDateRange(week);
    setSelectedOption('currentWeek');
    setAppliedFilters('');
    setError(initialError);
    fetchAttendances(true, {
      SupervisorId: undefined,
      FromDate: week.from,
      ToDate: week.to,
    });
  };

  const handleSearch = () => {
    if (!validate()) return;
    const filterText = [supervisor?.name, dateRange.from, dateRange.to]
      .filter(Boolean)
      .join(', ');
    setAppliedFilters(filterText || 'Search');
    setFilterOpen(false);
    setError(initialError);
    fetchAttendances(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await supervisorAttendanceService.deleteSupervisorAttendance(id);
      setAttendances(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.log('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchAttendances(true);
  }, []);

  return {
    attendances,
    loading,
    paginationLoading,
    hasMore,
    hasSearchFilter,
    appliedFilters,
    filterOpen,
    setFilterOpen,
    supervisor,
    setSupervisor,
    dateRange,
    setDateRange,
    selectedOption,
    setSelectedOption,
    error,
    supervisorDetails,
    fetchSupervisors,
    fetchAttendances,
    handleSearch,
    handleClearSearch,
    handleDelete,
    isFiltered,
  };
}