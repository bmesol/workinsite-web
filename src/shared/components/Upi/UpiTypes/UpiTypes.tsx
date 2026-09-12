import React from "react";
import { UpiEditDeleteButtons } from "../UpiEditDeleteButtons/UpiEditDeleteButtons";
import { Icons } from "./UpiTypesIcon";
import type { UpiTypesProps } from "../DTOs/DTOs";

const UpiTypes = (props: UpiTypesProps) => {
  const { details, setDetails, isColsTwo = false, disabled } = props;

  return (
    <>
      {details.upiDetails.map((item, index) => (
        <React.Fragment key={index}>
          {item.value && (
            <div className={`${isColsTwo ? "w-full mt-2" : "md:w-8/12 lg:w-6/12"} flex justify-between items-center break-all`}>
              <div className="flex items-center gap-1">
                <div>{Icons[item.upiType] || Icons.DEFAULT}</div>
                <span className="text-sm text-gray-700 ml-1">{item.value}</span>
              </div>
              <UpiEditDeleteButtons
                details={details}
                setDetails={setDetails}
                selectedItem={{ id: index, item }}
                disabled={disabled}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export { UpiTypes };