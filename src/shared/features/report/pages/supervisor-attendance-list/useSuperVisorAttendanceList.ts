import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupervisorAttendanceService } from '../../service/SupervisorAttendanceService';
import { createUserService } from '@/shared/features/users/services/UserService';
import { getWeekRangeHyphen as getWeekRange } from '@/shared/utils/formatters';
import type { SupervisorAttendance } from '../../DTOs/SupervisorAttendanceProps';
import { useSupervisorAttendanceInputValidate } from '../../components/InputValidate/SupervisorAttendanceInputValidate';


function ddmmyyyyToDate(ddmmyyyy: string): Date | null {
  if (!ddmmyyyy) return null;
  const [d, m, y] = ddmmyyyy.split('-').map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}

const PAGE_SIZE = 10;

export function useSupervisorAttendanceList() {
  const navigate = useNavigate();

  const supervisorAttendanceService = useSupervisorAttendanceService();
  const userService = createUserService();

  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [attendances, setAttendances] = useState<SupervisorAttendance[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hasSearchFilter, setHasSearchFilter] = useState(false);
  const [supervisor, setSupervisor] = useState({ name: '', value: '' });
  const [supervisorList, setSupervisorList] = useState<any[]>([]);
  const [appliedFilters, setAppliedFilters] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    'lastWeek' | 'currentWeek' | 'custom'
  >('currentWeek');

  const [dateRange, setDateRange] = useState(getWeekRange('currentWeek'));

  const { validate, error, initialError, setError } =
    useSupervisorAttendanceInputValidate({
      fromDate: ddmmyyyyToDate(dateRange.from),
      toDate:   ddmmyyyyToDate(dateRange.to),
    });

  const isFiltered = useMemo(
    () => supervisor.value || dateRange.from || dateRange.to,
    [supervisor, dateRange],
  );

  // updates both label and dateRange when switching presets
  const handleOptionChange = (opt: 'lastWeek' | 'currentWeek' | 'custom') => {
    setSelectedOption(opt);
    if (opt !== 'custom') {
      setDateRange(getWeekRange(opt)); // dd-mm-yyyy from formatters
    }
  };

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
        ToDate:   'ToDate'   in overrideObj ? overrideObj.ToDate   : dateRange.to,
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
    } catch {
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const fetchSupervisors = async (text = '') => {
    try {
      const res = await userService.getUsers(text);
      const supervisors = (res || []).filter(
        (u: any) => u.role?.name?.toLowerCase() === 'supervisor',
      );
      setSupervisorList(supervisors.slice(0, 3));
    } catch {
    }
  };

  const supervisorDetails = supervisorList.map(item => ({
    label: `${item.name} [${item.role?.name ?? ''}]`,
    value: item.id.toString(),
    allItems: { value: item.id.toString(), name: item.name },
  }));

  const handleClearSearch = () => {
    const week = getWeekRange('currentWeek'); // dd-mm-yyyy
    setSupervisor({ name: '', value: '' });
    setDateRange(week);
    setSelectedOption('currentWeek');
    setAppliedFilters('');
    setError(initialError);
    fetchAttendances(true, {
      SupervisorId: undefined,
      FromDate: week.from,
      ToDate:   week.to,
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
    } catch {
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
    handleOptionChange,
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