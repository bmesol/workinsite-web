import { useNavigate } from 'react-router-dom';
import { Header, Actions } from '@/shared/components/Header/Header';
import { Button } from '@/shared/components/ui/button';
import { GetStartedCard } from '@/shared/components/GetStartedCard/GetStartedCard';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useCuringList } from './useCuringList';
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { CuringUrls } from '../../utils/urls';
import CuringCard from '@/shared/components/CuringCard/CuringCard';
import { SearchFilterBar } from '@/shared/components/SearchFilterBar/SearchFilterBar';
import curingImage from '@/assets/images/client-creation-illustration.png';

const CuringListPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const {
    curingList,
    loading,
    appliedFilters,
    filterOpen, setFilterOpen,
    deleteId, setDeleteId,
    siteName, setSiteName,
    curingType, setCuringType,
    siteDetails,
    curingTypeDetails,
    fetchSites,
    fetchCuringTypes,
    handleEditCuring,
    handleCuringDelete,
    confirmDelete,
    handleSearch,
    handleClearSearch,
    handlePress,
  } = useCuringList();

  const isFiltered = !!(siteName.value || curingType.value);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">{t('Loading...')}</p>
      </div>
    );
  }

  if (!curingList.length && !appliedFilters) {
    return (
      <GetStartedCard
        imgSrc={curingImage}
        buttonClick={CuringUrls.create}
        buttonLabel={t('New Curing')}
      >
        With WorkInSite, tracking curing activities is easy. Start adding
        curing records today to monitor progress and status.
      </GetStartedCard>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* ── Header ── */}
      <Header title={t('Curing List')}>
        <Actions>
          <Button onClick={handlePress}>{t('New Curing')}</Button>
        </Actions>
      </Header>

      {/* ── Filter / Search bar ── */}
      <SearchFilterBar
        appliedFilters={appliedFilters}
        placeholder={t('Search Curing')}
        onFilterOpen={() => setFilterOpen(true)}
        onClearSearch={handleClearSearch}
      />

      {/* ── List ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {curingList.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground mt-10">
            {t('No curings found')}
          </p>
        ) : (
          curingList.map(item => (
            <CuringCard
              key={item.id}
              siteName={item.siteId.name}
              curingType={item.curingType.curingType}
              startDate={item.startDate}
              endDate={item.endDate}
              onDelete={() => confirmDelete(item.id)}
              onPress={() => handleEditCuring(item.id)}
              permissionKey="Curing"
            />
          ))
        )}
      </div>

      {/* ── Filter Dialog ── */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[var(--card)]">
          <DialogHeader>
            <DialogTitle>{t('Curing Search')}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <ComboboxField
              id="site"
              label={t('Site')}
              items={siteDetails}
              selectedValue={siteName.value}
              onValueChange={val =>
                setSiteName({
                  value: val,
                  name: siteDetails.find(s => s.value === val)?.label || '',
                })
              }
              onSearch={fetchSites}
            />
            <ComboboxField
              id="curingType"
              label={t('Curing Type')}
              items={curingTypeDetails}
              selectedValue={curingType.value}
              onValueChange={val =>
                setCuringType({
                  value: val,
                  name: curingTypeDetails.find(ct => ct.value === val)?.label || '',
                })
              }
              onSearch={fetchCuringTypes}
            />
            <Button
              onClick={() => {
                handleSearch();
                setFilterOpen(false);
              }}
              disabled={!isFiltered}
              className="w-full"
            >
              {t('Search')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={val => !val && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Confirm Delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Are you sure you want to delete this curing record?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                {t('Cancel')}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => deleteId && handleCuringDelete(deleteId)}
              >
                {t('Delete')}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default CuringListPage;
