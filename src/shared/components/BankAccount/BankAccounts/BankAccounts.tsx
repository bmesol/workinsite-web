import React from "react";
import { Landmark } from "lucide-react";
import { BankAccountEditDeleteButtons } from "../BankAccountEditDeleteButton/BankAccountEditDeleteButtons";
import type { BankAccountTypesProps } from "../DTOs/DTOs";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const BankAccounts = (props: BankAccountTypesProps) => {
  const { t } = useLanguage();
  const { details, setDetails, isColsTwo = false } = props;

  return (
    <>
      {details.bankAccounts.map((item, index) => (
        <React.Fragment key={index}>
          {item.accountName && (
            <div className={`${isColsTwo ? "w-full mt-2" : "md:w-8/12 lg:w-6/12"} flex justify-between items-center break-all`}>
              <div className="flex items-start gap-2">
                <Landmark className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-gray-700">{item.accountName}</span>
                  <span className="text-sm text-gray-700">{item.accountNumber}</span>
                  <span className="text-sm text-gray-700">{item.ifscCode}</span>
                  <button onClick={() => {}} className="text-xs text-gray-500 hover:text-gray-700 underline text-left transition-colors">
                    {t('View More')}
                  </button>
                </div>
              </div>
              <BankAccountEditDeleteButtons
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

export { BankAccounts };