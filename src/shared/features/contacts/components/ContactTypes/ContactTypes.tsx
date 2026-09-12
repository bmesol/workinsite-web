import { ContactEditDeleteButtons } from "../ContactEditDeleteButtons/ContactEditDeleteButtons";
import { Icons } from "./ContactTypesIcon";
import type { ContactTypesProps } from "./DTOs";
import React from "react";

const ContactTypes = (props: ContactTypesProps) => {
  const { contactList, setContactList, showEditDeleteButtons = true, classNames = "", disabled } = props;

  return (
    <div className={`flex flex-col gap-1 ${classNames}`}>
      {contactList.contactDetails.map((item, index) => (
        <React.Fragment key={index}>
          {item.value && (
            <div
              className={`
                ${showEditDeleteButtons ? "md:w-2/3 lg:w-1/2" : "w-full"}
                flex justify-between items-center
              `}
            >
              {/* Icon + Value */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="shrink-0">{Icons[item.contactType] || Icons.DEFAULT}</span>
                <span className="text-sm text-black break-all">{item.value}</span>
              </div>

              {/* Edit / Delete Buttons */}
              {showEditDeleteButtons && (
                <ContactEditDeleteButtons
                  contactList={contactList}
                  setContactList={setContactList}
                  selectedItem={{ id: index, item }}
                  disabled={disabled}
                />
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export { ContactTypes };