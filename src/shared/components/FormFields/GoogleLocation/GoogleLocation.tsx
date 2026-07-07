import { MapPin } from "lucide-react";
import { FormInput } from "../../FormInput/FormInput";
import { TextareaField } from "../TextareaField";
import type { GoogleLocationProps } from "./DTOs";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const GoogleLocation = (props: GoogleLocationProps) => {
  const { t } = useLanguage();
  const { errorMessage, inputValue, setInputValue, classNames = "", placeholder, required = false } = props;

  return (
    <div className={`relative ${classNames}`}>
      <FormInput errorMessage={errorMessage}>
        <TextareaField
          label={t("Google Location")}
          inputValue={inputValue}
          setInputValue={setInputValue}
          placeholder={placeholder || t("Enter google location")}
          required={required}
        />
      </FormInput>

      <div className="absolute top-0 right-0 mr-4 flex items-center gap-1.5 get-location">
        <MapPin className="w-5 h-5 text-muted-foreground" />
         <a
          href="https://www.google.com/maps"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          {t("Get Location")}
        </a>
      </div>
    </div>
  );
};

export { GoogleLocation };