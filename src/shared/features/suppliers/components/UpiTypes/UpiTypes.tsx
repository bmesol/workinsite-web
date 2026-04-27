import React from "react";
import { UpiEditDeleteButtons } from "../UpiEditDeleteButtons/UpiEditDeleteButtons";
import { Icons } from "./UpiTypesIcon";
import type { UpiTypesProp } from "./DTOs";

const UpiTypes = (props: UpiTypesProp) => {
  const { supplierDetails, setSupplierDetails, isColsTwo = false } = props;

  return (
    <>
      {supplierDetails.upiDetails.map((item, index) => (
        <React.Fragment key={index}>
          {item.value && (
            <div
              className={`${
                isColsTwo ? "w-full mt-4" : "md:w-8/12 lg:w-6/12"
              } flex justify-between items-start break-all`}
            >
              {/* Icon + Label */}
              <div className="flex items-center gap-1">
                <div>{Icons[item.upiType] || Icons.DEFAULT}</div>
                <span className="text-sm text-gray-700 ml-1">{item.value}</span>
              </div>

              {/* Edit / Delete Buttons */}
              <UpiEditDeleteButtons
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

export { UpiTypes };