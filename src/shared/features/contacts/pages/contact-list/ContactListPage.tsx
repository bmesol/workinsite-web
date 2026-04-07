import { ContactGetStartedPage } from "@/shared/features/contacts/pages/contact-get-started/ContactGetStartedPage";
import { ContactCard } from "@/shared/components/ContactCard/ContactCard";
import { Header, Actions } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useContactList } from "./useContactListPage";
import { ContactsUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";

const ContactListPage = () => {
  const navigate = useNavigate();
  const {
    contactList,
    fetchContact,
    handleContactSelect,
    handleContactDelete,
    hasSearchFilter,
  } = useContactList();

  if (!contactList.length && !hasSearchFilter) return <ContactGetStartedPage />;
  console.log(contactList);

  return (
    <div className=" w-full min-h-screen px-4 py-6">
      <Header title="Contacts">
        <Actions>
          <Button onClick={() => navigate(ContactsUrls.create)}>
            New Contact
          </Button>
        </Actions>
      </Header>

      {/* Search Box */}
      <div className="flex justify-end mt-4 mb-4">
        <Input
          type="text"
          placeholder="Search contacts..."
          onChange={(e) => {
            const value = e.target.value;
            if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
              fetchContact(value);
            }
          }}
          className="w-72"
        />
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
                  handleContactDelete(e, contact.id)
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { ContactListPage };
