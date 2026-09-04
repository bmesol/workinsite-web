import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Actions } from '@/shared/components/Header/Header';
import { Button } from '@/shared/components/ui/button';
import { GetStartedCard } from '@/shared/components/GetStartedCard/GetStartedCard';
import { SearchBar } from '@/shared/components/SearchBar/SearchBar';
import { ContactCard } from '@/shared/components/ContactCard/ContactCard';
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
import { useCuringTypeList } from './useCuringTypeList';
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { CuringTypeUrls } from '../../utils/urls';
import curingImage from '@/assets/images/client-creation-illustration.png';

const CuringTypeListPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const {
    curingTypeList,
    loading,
    searchText,
    setSearchText,
    confirmDelete,
    deleteId,
    setDeleteId,
    handleCuringTypeDelete,
    handleEditCuringType,
  } = useCuringTypeList();

  const filteredList = useMemo(
    () =>
      curingTypeList.filter(item =>
        item.curingType.toLowerCase().includes(searchText.trim().toLowerCase()),
      ),
    [curingTypeList, searchText],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">{t('Loading...')}</p>
      </div>
    );
  }

  if (!curingTypeList.length) {
    return (
      <GetStartedCard
        imgSrc={curingImage}
        buttonClick={CuringTypeUrls.create}
        buttonLabel={t('New Curing Type')}
      >
        Start adding curing types to categorize your curing activities.
      </GetStartedCard>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 py-6">

      <Header title={t('Curing Type List')}>
        <Actions>
          <Button onClick={() => navigate(CuringTypeUrls.create)}>
            {t('New Curing Type')}
          </Button>
        </Actions>
      </Header>

      <div className="flex justify-end mt-4 mb-4">
        <div className="w-full md:w-3/12">
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            searchCategory={t('Search Curing Types')}
            allowAllCharacters
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {filteredList.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground mt-10">
            {t('No curing types found')}
          </p>
        ) : (
          filteredList.map(item => (
            <ContactCard
              key={item.id}
              name={item.curingType}
              onDelete={() => confirmDelete(item.id)}
              onPress={() => handleEditCuringType(item.id)}
              permissionKey="Curing Types"
            />
          ))
        )}
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={val => !val && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Confirm Delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Are you sure you want to delete this curing type?')}
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
                onClick={() => deleteId && handleCuringTypeDelete(deleteId)}
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

export default CuringTypeListPage;
