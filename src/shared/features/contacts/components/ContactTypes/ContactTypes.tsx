import { ContactEditDeleteButtons } from "../ContactEditDeleteButtons/ContactEditDeleteButtons";
import { Icons } from "./ContactTypesIcon";
import type { ContactTypesProps } from "./DTOs";
import React from "react";

const ContactTypes = (props: ContactTypesProps) => {
  const { contactList, setContactList, showEditDeleteButtons = true, classNames = "" } = props;

  return (
    <>
      {contactList.contactDetails.map((item, index) => (
        <React.Fragment key={index}>
          {item.value && (
            <div 
              className={`
                ${showEditDeleteButtons ? "md:w-2/3 lg:w-1/2" : "w-full"}
                flex justify-between items-start break-all m-0 p-0  ${classNames}
              `}
            >
              {/* Icon + Value */}
              <div className="flex items-center gap-2">
                <div>{Icons[item.contactType] || Icons.DEFAULT}</div>
                <span className="text-sm text-foreground">{item.value}</span>
              </div>

              {/* Edit / Delete Buttons */}
              {showEditDeleteButtons && (
                <ContactEditDeleteButtons
                  contactList={contactList}
                  setContactList={setContactList}
                  selectedItem={{ id: index, item }}
                />
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export { ContactTypes };