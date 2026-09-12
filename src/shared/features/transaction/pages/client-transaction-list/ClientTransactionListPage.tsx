import { Header, Actions } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { DatePicker } from "@/shared/components/FormFields/DatePicker";
import TransactionCard from "@/shared/components/TransactionCard/TransactionCard";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar/SearchFilterBar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useClientTransactionList } from "./useClientTransactionList";
import { ClientTransactionUrls } from "../../utils/urls";
import clientTransactionImage from "@/assets/images/client-creation-illustration.png";
import { useLanguage } from "@/shared/hooks/useLanguageContext";
import { usePermission } from "@/shared/hooks/usePermission";

const ClientTransactionListPage = () => {
  const { t } = useLanguage();
  const { canEdit } = usePermission();
  const hasPermission = canEdit('Client Transaction');

  const {
    client,
    setClient,
    clientDetails,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    fetchClients,
    transactions,
    handleEdit,
    handleDeleteConfirm,
    handleCreate,
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
    handleDelete,
    fetchTransactions,
  } = useClientTransactionList();

  const isFiltered = !!(fromDate || toDate || client?.value);

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
        imgSrc={clientTransactionImage}
        buttonClick={ClientTransactionUrls.create}
        buttonLabel={t("New Client Transaction")}
        disabled={!hasPermission}
      >
        Start by creating your client transactions to organize and manage your
        records efficiently.
      </GetStartedCard>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6">
      {/* ── Header ── */}
      <Header title={t("Client Transaction List")}>
        <Actions>
          <Button onClick={handleCreate} disabled={!hasPermission}>{t("New Client Transaction")}</Button>
        </Actions>
      </Header>

      {/* ── Filter / Search bar ── */}
      <div className="flex justify-end">
        <SearchFilterBar
          appliedFilters={appliedFilters}
          placeholder={t("Search client transaction")}
          onFilterOpen={() => setFilterOpen(true)}
          onClearSearch={handleClearSearch}
        />
      </div>

      {/* ── List ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pb-4">
        {transactions.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground mt-10">
            No client transaction found
          </p>
        ) : (
          transactions.map((item) => (
            <TransactionCard
              id={item.id}
              name={item.client.name}
              amount={item.totalAmount ?? item.amount}
              date={item.date}
              paymentMethod={item.paymentMethod}
              onDelete={handleDeleteConfirm}
              onPress={handleEdit}
              permissionKey="Client Transaction"
            />
          ))
        )}
      </div>

      {/* ── View More ── */}
      {hasMore && transactions.length > 0 && (
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={() => fetchTransactions()}
            disabled={paginationLoading}
          >
            {paginationLoading ? "Loading..." : t("View More")}
          </Button>
        </div>
      )}

      {/* ── Filter Dialog ── */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[var(--card)]">
          <DialogHeader>
            <DialogTitle>{t("Search")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <ComboboxField
              id="client"
              label={t("Client")}
              items={clientDetails}
              selectedValue={client?.value ?? ""}
              onValueChange={(val) =>
                setClient({
                  value: val,
                  name: clientDetails.find((c) => c.value === val)?.label || "",
                })
              }
              onSearch={fetchClients}
            />
            <DatePicker
              label="From Date"
              date={fromDate}
              onDateChange={setFromDate}
            />
            <DatePicker label="To Date" date={toDate} onDateChange={setToDate} />
            <Button
              onClick={() => {
                handleSearch();
                setFilterOpen(false);
              }}
              disabled={!isFiltered}
              className="w-full"
            >
              {t("Search")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              {t('Confirm Delete')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {t('Are you sure you want to delete this client transaction?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                {t("Cancel")}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => deleteId && handleDelete(deleteId)}
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

export default ClientTransactionListPage;
