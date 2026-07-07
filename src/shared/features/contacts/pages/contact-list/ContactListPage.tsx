import { ContactGetStartedPage } from "@/shared/features/contacts/pages/contact-get-started/ContactGetStartedPage";
import { ContactCard } from "@/shared/components/ContactCard/ContactCard";
import { Header, Actions } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { useContactList } from "./useContactListPage";
import { ContactsUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const ContactListPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const { t } = useLanguage();

  const {
    contactList,
    fetchContact,
    handleContactSelect,
    confirmDelete,
    handleContactDelete,
    hasSearchFilter,
    loading,
    searchLoading,
    deleteId,
    setDeleteId,
  } = useContactList();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!contactList.length && !hasSearchFilter) return <ContactGetStartedPage />;

  return (
    <div className="min-h-screen w-full px-4 py-6">
      {/* Header */}
      <Header title={t('Contact List')}>
        <Actions>
          <Button onClick={() => navigate(ContactsUrls.create)}>
            {t('New Contact')}
          </Button>
        </Actions>
      </Header>

      {/* SearchBar ✅ */}
      <div className="flex justify-end mt-4 mb-4">
        <div className="w-full md:w-3/12">
          <SearchBar
            searchText={searchValue}
            setSearchText={(val) => {
              setSearchValue(val);
              fetchContact(val);
            }}
            searchCategory={t('Search contacts')}
          />

        </div>
      </div>

      {/* Contact List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pb-4">
        {!contactList.length ? (
          <div className="col-span-2 my-4 text-center text-muted-foreground">
            No contacts found
          </div>
        ) : (
          contactList.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleContactSelect(contact.id)}
              className="cursor-pointer"
            >
              <ContactCard
                name={contact.name}
                phone={contact.phone}
                email={contact.email}
                onDelete={(e: React.MouseEvent) =>
                  confirmDelete(e, contact.id)
                }
              />
            </div>
          ))
        )}
      </div>

      {/* ✅ Delete Confirm Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete this contact?
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
                onClick={() => deleteId && handleContactDelete(deleteId)}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { ContactListPage };
