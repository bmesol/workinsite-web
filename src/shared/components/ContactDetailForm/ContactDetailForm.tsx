import { ContactTypes } from "@/shared/features/contacts/components/ContactTypes/ContactTypes";
import { FormActionButton } from "../FormActionButton/FormActionButton";
import type { ContactDetailFormProps } from "./DTOs";

const ContactDetailForm = (props: ContactDetailFormProps) => {
  const { handleContactEdit, primaryContactDetails, hasMoreDetails, handleMoreDetails, classNames = "", isColsTwo = true } = props;

  return (
    <div className={`mt-4 ${classNames}`}>
      <FormActionButton heading="Contact detail" label="Edit" onClick={handleContactEdit} isColsTwo={isColsTwo} />
      <ContactTypes contactList={primaryContactDetails} showEditDeleteButtons={false} classNames="mt-4" />
      {hasMoreDetails && (
        <div className="mt-4">
          <button
            onClick={handleMoreDetails}
            className="ml-3 text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            More details...
          </button>
        </div>
      )}
    </div>
  );
};

export { ContactDetailForm };