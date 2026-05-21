import { KycEditDeleteButtons } from "../KycEditDeleteButtons/KycEditDeleteButtons";
import { displayWithSegments } from "@/shared/utils/app";
import { KYCTypes, type KycTypesProps } from "../DTOs/DTOs";
import { Icons } from "./KycTypesIcon";
import React from "react";

const KycTypes = (props: KycTypesProps) => {
  const { details, setDetails, isColsTwo } = props;

  return (
    <>
      {details.kycDetails.map((item, index) => (
        <React.Fragment key={index}>
          {item.value && (
            <div className={`flex justify-between items-center text-break w-full mt-2 ${isColsTwo ? "" : "md:w-2/3 lg:w-1/2"}`}>
              <div className="flex items-center gap-1">
                <div>{Icons[item.kycType] || Icons.DEFAULT}</div>
                <span className="text-sm text-black ms-1">
                  {item.kycType === KYCTypes.AADHAAR
                    ? displayWithSegments(item.value, 4)
                    : item.value}
                </span>
              </div>
              <KycEditDeleteButtons
                details={details}
                setDetails={setDetails}
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