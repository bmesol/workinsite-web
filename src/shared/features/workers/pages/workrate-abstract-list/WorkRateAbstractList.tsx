import { useNavigate } from "react-router-dom";
import { Header } from "@/shared/components/Header/Header";

import { Button } from "@/shared/components/ui/button";
import { ContactCard } from "@/shared/components/ContactCard/ContactCard";
import { WorkRateAbstractUrls } from "../../utils/urls";
import { useWorkRateAbstractList } from "./useWorkRateAbstractList";
import type { WorkRateAbstractProps } from "../../DTOs/WorkRateAbstract";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar";
import { DeleteConfirmDialog } from "@/shared/components/DeleteConfirmDialog/DeleteConfirmDialog";
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { usePermission } from '@/shared/hooks/usePermission';

const WorkRateAbstractListPage = () => {
  const { t } = useLanguage();
  const { canEdit } = usePermission();
  const hasPermission = canEdit('Work Rate Abstract');
  const navigate = useNavigate();

  const {
    workRateAbstract,
    handleEditworkRateAbstract,
    loading,
    confirmDelete,
    handleDelete,
    handleCancelDelete,
    deleteId,
    searchText,
    setSearchText,
  } = useWorkRateAbstractList();

  // client-side filter by site name
  const filteredList = workRateAbstract?.filter((item: WorkRateAbstractProps) =>
    item.site?.name?.toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6 pb-10">
      <Header title={t('Work Rate Abstract List')}>
        <Button onClick={() => navigate(WorkRateAbstractUrls.create)} disabled={!hasPermission}>
          {t('Create Work Rate Abstract')}
        </Button>
      </Header>

      {/* Search bar */}
     <div className="flex justify-end mt-4 mb-4">
  <div className="w-full md:w-3/12">
    <SearchBar
      searchText={searchText}
      setSearchText={setSearchText}
      placeholder={t('Search work rate abstract')}
    />
  </div>
</div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
        {filteredList.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-10">
            {t('No Work Rate Abstract found')}
          </p>
        ) : (
          filteredList.map((item: WorkRateAbstractProps) => (
            <ContactCard
              key={item.id}
              name={item.site.name}
              workType={item.workType.name}
              onDelete={() => confirmDelete(item.id)}
              onPress={() => handleEditworkRateAbstract(item.id)}
              permissionKey="Work Rate Abstract"
            />
          ))
        )}
      </div>

      {/* Delete confirm dialog */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onClose={handleCancelDelete}
        onConfirm={handleDelete}
        description={t('Are you sure you want to delete this Detail?')}
      />
    </div>
  );
};

export { WorkRateAbstractListPage };
