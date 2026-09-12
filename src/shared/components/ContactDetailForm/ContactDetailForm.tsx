import { ContactTypes } from "@/shared/features/contacts/components/ContactTypes/ContactTypes";
import { FormActionButton } from "../FormActionButton/FormActionButton";
import type { ContactDetailFormProps } from "./DTOs";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const ContactDetailForm = (props: ContactDetailFormProps) => {
  const { t } = useLanguage();
  const { handleContactEdit, primaryContactDetails, hasMoreDetails, handleMoreDetails, classNames = "", isColsTwo = true, isAddDisabled } = props;

  return (
    <div className={`mt-4 ${classNames}`}>
      <FormActionButton heading={t("Contact detail")} label={t("Edit")} onClick={handleContactEdit} isColsTwo={isColsTwo} isAddDisabled={isAddDisabled} />
      <ContactTypes contactList={primaryContactDetails} showEditDeleteButtons={false} classNames="mt-4" />
      {hasMoreDetails && (
        <div className="mt-4">
          <button
            onClick={handleMoreDetails}
            className="ml-3 text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            {t("More details...")}
          </button>
        </div>
      )}
    </div>
  );
};

export { ContactDetailForm };