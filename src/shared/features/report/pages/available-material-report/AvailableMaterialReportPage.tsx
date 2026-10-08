import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '@/shared/hooks/usePermission';
import { X, PackageSearch } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
import { Loader } from '@/shared/components/Loader/Loader';
import { SearchFilterBar } from '@/shared/components/SearchFilterBar/SearchFilterBar';
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
import { exportAvailableMaterialToExcel, exportAvailableMaterialToPDF } from '../../utils/exportAvailableMaterialReport';
import sheetsIcon from '@/assets/icons/sheets.png';
import pdfIcon from '@/assets/icons/pdf.png';
import { toast } from 'sonner';

const AvailableMaterialReportScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { canView } = usePermission();

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

  const hasViewAccess = canView('Available Material Report') || canView('Reports');

  useEffect(() => {
    if (!hasViewAccess) navigate('/dashboard', { replace: true });
  }, []);

  useEffect(() => {
    const onPopState = () => handleBack();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [handleBack]);

  if (!hasViewAccess) return null;

  if (loading && !refreshing) return <Loader isLoading={true} />;

  const hasData = reportData.length > 0;
  const exportFilters = { site: site.name, date: date?.toString() };

  return (
    <div className="min-h-screen w-full py-6">
      <div className="px-4">
        {/* Desktop / tablet: title + filter bar + export buttons on one row */}
        <div className="hidden sm:block">
          <Header title="Available Material Report">
            <Actions>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <div className="-mt-4">
                  <SearchFilterBar
                    appliedFilters={appliedFilters}
                    placeholder={t('Search material report')}
                    onFilterOpen={() => {
                      fetchMaterials('');
                      setIsFilterOpen(true);
                    }}
                    onClearSearch={handleClearSearch}
                  />
                </div>
                {hasData && (
                  <>
                    <Button
                      onClick={async () => {
                        try {
                          await exportAvailableMaterialToExcel(reportData, exportFilters);
                        } catch (err) {
                          console.error('[Export Excel]', err);
                          toast.error('Excel export failed. Please try again.');
                        }
                      }}
                      className="h-9 gap-1.5 rounded-md bg-green-700 text-white hover:bg-green-800"
                      style={{ fontSize: 'var(--font-sm)', fontFamily: 'Outfit, sans-serif' }}
                    >
                      <img src={sheetsIcon} alt="" className="w-3.5 h-3.5 object-contain" />
                      Export Excel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          await exportAvailableMaterialToPDF(reportData, exportFilters);
                        } catch (err) {
                          console.error('[Export PDF]', err);
                          toast.error('PDF export failed. Please try again.');
                        }
                      }}
                      className="h-9 gap-1.5 rounded-md border-red-400 text-red-600 hover:bg-red-50 hover:text-red-700"
                      style={{ fontSize: 'var(--font-sm)', fontFamily: 'Outfit, sans-serif' }}
                    >
                      <img src={pdfIcon} alt="" className="w-3.5 h-3.5 object-contain" />
                      Download PDF
                    </Button>
                  </>
                )}
              </div>
            </Actions>
          </Header>
        </div>

        {/* Mobile: title → filter bar → export buttons */}
        <div className="sm:hidden">
          <h2 className="text-secondary font-bold text-xl leading-tight pt-4">
            Available Material<br />Report
          </h2>
          <SearchFilterBar
            appliedFilters={appliedFilters}
            placeholder={t('Search material report')}
            onFilterOpen={() => {
              fetchMaterials('');
              setIsFilterOpen(true);
            }}
            onClearSearch={handleClearSearch}
          />
          {hasData && (
            <div className="flex gap-3 mt-4">
              <Button
                onClick={async () => {
                  try {
                    await exportAvailableMaterialToExcel(reportData, exportFilters);
                  } catch (err) {
                    console.error('[Export Excel]', err);
                    toast.error('Excel export failed. Please try again.');
                  }
                }}
                className="flex-1 h-9 gap-1.5 rounded-md bg-green-700 text-white hover:bg-green-800"
                style={{ fontSize: 'var(--font-sm)', fontFamily: 'Outfit, sans-serif' }}
              >
                <img src={sheetsIcon} alt="" className="w-3.5 h-3.5 object-contain" />
                Export Excel
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await exportAvailableMaterialToPDF(reportData, exportFilters);
                  } catch (err) {
                    console.error('[Export PDF]', err);
                    toast.error('PDF export failed. Please try again.');
                  }
                }}
                className="flex-1 h-9 gap-1.5 rounded-md border-red-400 text-red-600 hover:bg-red-50 hover:text-red-700"
                style={{ fontSize: 'var(--font-sm)', fontFamily: 'Outfit, sans-serif' }}
              >
                <img src={pdfIcon} alt="" className="w-3.5 h-3.5 object-contain" />
                Download PDF
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Availability Badge */}
      {hasData && (
        <div className="flex justify-end mt-2 px-4">
          <div className={cn(
            'self-start px-2.5 py-2 rounded-md border text-sm font-medium',
            'bg-blue-50 border-blue-200 text-blue-700',
          )}>
            ✓ {reportData.length} material(s) found
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto mt-2 px-4 pb-10">
        {refreshing && (
          <div className="text-center py-2 text-sm text-gray-400">
            {t('Refreshing...')}
          </div>
        )}

        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <PackageSearch size={48} className="mb-4 opacity-30" />
            <p className="font-semibold text-slate-500">{t('No Data Found')}</p>
            <p className="text-sm mt-1">{t('Try adjusting your Search filters')}</p>
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
              <Button
                onClick={handleSearch}
                className="w-full h-11 font-semibold"
                style={{ fontSize: 'var(--font-md)' }}
              >
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