import { ContactGetStartedPage } from "@/shared/features/contacts/pages/contact-get-started/ContactGetStartedPage";
import { ContactCard } from "@/shared/components/ContactCard/ContactCard";
import { Header, Actions } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { useContactList } from "./useContactListPage";
import { ContactsUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar";
import { useState } from "react";
import { DeleteConfirmDialog } from "@/shared/components/DeleteConfirmDialog/DeleteConfirmDialog";
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { usePermission } from '@/shared/hooks/usePermission';

const ContactListPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const { t } = useLanguage();
  const { canEdit } = usePermission();
  const editable = canEdit('Contacts');

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
          <Button onClick={() => navigate(ContactsUrls.create)} disabled={!editable}>
            {t('New Contact')}
          </Button>
        </Actions>
      </Header>

      {/* SearchBar */}
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
          <div className="col-span-full flex w-full flex-col items-center justify-center py-16 px-4">
            <p className="text-center text-muted-foreground text-sm break-words">{t('No contacts found')}</p>
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
                email={
                  contact.email ??
                  contact.contactDetails?.find((d) => d.contactType === 'Email')?.value
                }
                onDelete={(e: React.MouseEvent) =>
                  confirmDelete(e, contact.id)
                }
                permissionKey="Contacts"
              />
            </div>
          ))
        )}
      </div>

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleContactDelete(deleteId)}
        description={t('Are you sure you want to delete this contact?')}
      />
    </div>
  );
};

export { ContactListPage };
