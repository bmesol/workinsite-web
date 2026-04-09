import { KycEditDeleteButtons } from "../KycEditDeleteButtons/KycEditDeleteButtons";
import { displayWithSegments } from "@/shared/utils/app";
import type { ClientDetailsType } from "../../DTOs/ClientDetails";
import { KYCTypes } from "../../DTOs/ClientProps";
import { Icons } from "./KycTypesIcon";
import React from "react";

const KycTypes = (props: ClientDetailsType) => {
  const { clientDetails, setClientDetails } = props;

  return (
    <>
      {clientDetails.kycDetails.map((item, index) => (
        <React.Fragment key={index}>
          {item.value && (
            <div className="flex justify-between items-start text-break w-full md:w-2/3 lg:w-1/2">
              <div className="flex items-center gap-1">
                <div>{Icons[item.kycType] || Icons.DEFAULT}</div>
                <span className="text-sm text-black ms-1">
                  {item.kycType === KYCTypes.AADHAAR
                    ? displayWithSegments(item.value, 4)
                    : item.value}
                </span>
              </div>
              <KycEditDeleteButtons
                clientDetails={clientDetails}
                setClientDetails={setClientDetails}
                selectedItem={{ id: index, item }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export { KycTypes };