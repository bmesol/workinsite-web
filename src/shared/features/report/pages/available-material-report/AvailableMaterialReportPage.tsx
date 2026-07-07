import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, PackageSearch } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
import { Loader } from '@/shared/components/Loader/Loader';
import { SearchFilterBar } from '@/shared/components/SearchFilterBar/SerchFilterBar';
import { Header, Actions } from '@/shared/components/Header/Header';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { useAvailableMaterialReportScreen } from './useAvailableMaterialReport';
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { MaterialReportCard } from '@/shared/components/MaterialReportCard/MaterialReportCard';
import { MaterialMultiSelect } from '@/shared/components/MaterialMultiSelect/MaterialMultiSelect';
import { cn } from '@/shared/components/lib/utils';
import type { AvailableMaterialReport } from '@/shared/features/materials/service/MaterialUsedService';

const AvailableMaterialReportScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const {
    loading,
    refreshing,
    reportData,
    site,
    siteDetails,
    date,
    selectedMaterials,
    materialDetails,
    appliedFilters,
    error,
    isFilterOpen,
    setIsFilterOpen,
    setSite,
    setDate,
    fetchSites,
    fetchMaterials,
    toggleMaterial,
    handleSearch,
    handleClearSearch,
    handleRefresh,
    handleBack,
  } = useAvailableMaterialReportScreen({ navigate });

  useEffect(() => {
    const onPopState = () => handleBack();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [handleBack]);

  if (loading && !refreshing) return <Loader isLoading={true} />;

  return (
    <div className="min-h-screen w-full px-4 py-6 pb-10">

      {/* Header */}
      <Header title="Available Material Report">
        <Actions>
          <SearchFilterBar
            appliedFilters={appliedFilters}
            placeholder={t('Search material report')}
            onFilterOpen={() => {
              fetchMaterials('');
              setIsFilterOpen(true);
            }}
            onClearSearch={handleClearSearch}
          />
        </Actions>
      </Header>

      {/* Availability Badge — SearchFilterBar கீழே, right corner */}
      {reportData.length > 0 && (
        <div className="flex justify-end mt-2">
          <div className={cn(
            'self-start px-2.5 py-2 rounded-md border text-sm font-medium',
            'bg-blue-50 border-blue-200 text-blue-700',
          )}>
            ✓ {reportData.length} material(s) found
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto mt-2">
        {refreshing && (
          <div className="text-center py-2 text-sm text-gray-400">
            Refreshing...
          </div>
        )}

        {reportData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <PackageSearch size={48} className="mb-4 opacity-30" />
            <p className="font-semibold text-slate-500">No Data Found</p>
            <p className="text-sm mt-1">Try adjusting your Search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pb-4">
            {reportData.map((item: AvailableMaterialReport) => (
              <MaterialReportCard key={item.material.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Filter AlertDialog */}
      <AlertDialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <AlertDialogContent className="sm:max-w-md bg-white dark:bg-[var(--card)] flex flex-col max-h-[80vh]">

          <AlertDialogHeader className="relative">
            <AlertDialogTitle>Filter Material Report</AlertDialogTitle>
            <AlertDialogDescription className="sr-only">
              Filter by site, date and materials
            </AlertDialogDescription>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="absolute top-0 right-0 p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </AlertDialogHeader>

          <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1">
            <ComboboxField
              id="site"
              label="Site"
              items={siteDetails}
              selectedValue={site.value}
              onValueChange={(val) => {
                const found = siteDetails.find(s => s.value === val);
                setSite({ value: val, name: found?.label ?? '' });
              }}
              onSearch={fetchSites}
              error={error.site}
              required
            />

            <DatePicker
              label="Date"
              date={date}
              onDateChange={setDate}
              errorMessage={error.date}
              required
              defaultDate
              maxDate={undefined}
            />

            <MaterialMultiSelect
              materialDetails={materialDetails}
              selectedMaterials={selectedMaterials}
              onToggle={toggleMaterial}
              onSearch={fetchMaterials}
            />
          </div>

          <AlertDialogFooter className="pt-2">
            <AlertDialogAction asChild>
              <Button onClick={handleSearch} className="w-full">
                Search
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AvailableMaterialReportScreen;