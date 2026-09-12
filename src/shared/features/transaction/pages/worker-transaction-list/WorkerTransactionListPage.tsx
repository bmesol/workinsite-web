import { Header, Actions } from '@/shared/components/Header/Header';
import { Button } from '@/shared/components/ui/button';
import { GetStartedCard } from '@/shared/components/GetStartedCard/GetStartedCard';
import { SearchFilterBar } from '@/shared/components/SearchFilterBar/SearchFilterBar';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
import TransactionCard from '@/shared/components/TransactionCard/TransactionCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { useWorkerTransactionList } from './useWorkerTransactionList';
import type { WorkerTransactionProps } from '../../DTOs/WorkerTransaction';
import workerTransactionImage from '@/assets/images/client-creation-illustration.png';
import { WorkerTransactionUrls } from '../../utils/urls';
import { usePermission } from '@/shared/hooks/usePermission';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const WorkerTransactionListPage = () => {
  const { canEdit } = usePermission();
  const hasPermission = canEdit('Worker Transaction');
  const { t } = useLanguage();

  const {
    worker,
    workerDetails,
    setWorker,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    fetchWorkers,
    transactions,
    fetchWorkerTransactions,
    handleCreate,
    handleDeleteConfirm,
    confirmDelete,
    handleEdit,
    loading,
    handleSearch,
    handleClearSearch,
    paginationLoading,
    hasMore,
    appliedFilters,
    filterOpen,
    setFilterOpen,
    deleteId,
    setDeleteId,
  } = useWorkerTransactionList();

  const isFiltered = !!(fromDate || toDate || worker?.value);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!transactions.length && !appliedFilters) {
    return (
      <GetStartedCard
        imgSrc={workerTransactionImage}
        buttonClick={WorkerTransactionUrls.create}
        buttonLabel={t('New Worker Transaction')}
        disabled={!hasPermission}
      >
        Start by creating your Worker transactions to organize and manage your
        records efficiently.
      </GetStartedCard>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6 pb-10">

      {/* ── Header ── */}
      <Header title={t('Worker Transaction List')}>
        <Actions>
          <Button onClick={handleCreate} disabled={!hasPermission}>{t('New Worker Transaction')}</Button>
        </Actions>
      </Header>

      {/* ── Search Filter Bar ── */}
      <SearchFilterBar
        appliedFilters={appliedFilters}
        placeholder={t('Search worker transaction')}
        onFilterOpen={() => setFilterOpen(true)}
        onClearSearch={handleClearSearch}
      />

      {/* ── List ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {transactions.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground mt-10">
            No worker transaction found
          </p>
        ) : (
          transactions.map((item: WorkerTransactionProps) => (
            <TransactionCard
              key={item.id}
              id={item.id}
              name={item.worker.name}
              amount={item.amount}
              date={item.date}
              paymentMethod={item.paymentMethod}
              onDelete={confirmDelete}
              onPress={handleEdit}
              permissionKey="Worker Transaction"
            />
          ))
        )}
      </div>

      {/* ── View More ── */}
      {hasMore && transactions.length > 0 && (
        <div className="flex justify-end mt-4">
          {paginationLoading ? (
            <Loader2
              className="animate-spin"
              size={24}
              style={{ color: 'var(--secondary)' }}
            />
          ) : (
            <Button variant="outline" onClick={() => fetchWorkerTransactions()}>
              {t('View More')}
            </Button>
          )}
        </div>
      )}

      {/* ── Filter Dialog ── */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[var(--card)]">
          <DialogHeader>
            <DialogTitle>{t('Search Worker Transactions')}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <ComboboxField
              id="worker"
              label={t('Worker')}
              items={workerDetails}
              selectedValue={worker.value}
              onValueChange={(val) => {
                const found = workerDetails.find(i => i.value === val);
                if (found?.allItems) setWorker(found.allItems as any);
              }}
              onSearch={fetchWorkers}
            />
            <DatePicker
              label={t('From Date')}
              date={fromDate}
              onDateChange={setFromDate}
            />
            <DatePicker
              label={t('To Date')}
              date={toDate}
              onDateChange={setToDate}
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

      {/* ── Delete Confirm Dialog ── */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Confirm Delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Are you sure you want to delete this worker transaction?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              {t('Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                {t('Delete')}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default WorkerTransactionListPage;