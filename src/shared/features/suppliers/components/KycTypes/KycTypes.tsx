import React from "react";
import { KycEditDeleteButtons } from "../KycEditDeleteButtons/KycEditDeleteButtons";
import { displayWithSegments } from "@/shared/utils/app";
import { KYCTypes } from "../../../clients/DTOs/ClientProps";
import { Icons } from "./KycTypesIcon";
import type { kycTypesProp } from "./DTOs";

const KycTypes = (props: kycTypesProp) => {
  const { supplierDetails, setSupplierDetails, isColsTwo = false } = props;

  return (
    <>
      {supplierDetails.kycDetails.map((item, index) => (
        <React.Fragment key={index}>
          {item.value && (
            <div
              className={`${
                isColsTwo ? "w-full mt-4" : "md:w-8/12 lg:w-6/12"
              } flex justify-between items-start break-all`}
            >
              {/* Icon + Label */}
              <div className="flex items-center gap-1">
                <div>{Icons[item.kycType] || Icons.DEFAULT}</div>
                <span className="text-sm text-gray-700 ml-1">
                  {item.kycType === KYCTypes.AADHAAR
                    ? displayWithSegments(item.value, 4)
                    : item.value}
                </span>
              </div>

              {/* Edit / Delete Buttons */}
              <KycEditDeleteButtons
                supplierDetails={supplierDetails}
                setSupplierDetails={setSupplierDetails}
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