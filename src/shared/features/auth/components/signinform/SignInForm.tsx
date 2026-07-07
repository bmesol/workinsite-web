import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { PhoneNumberField } from "@/shared/components/FormFields/PhoneNumberField";
import { PinField } from "@/shared/components/FormFields/PinField";
import workInSiteLogo from "@/assets/images/work-insite-logo.png";
import { useSignInForm } from "./useSignInForm";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const SignInForm = () => {
  const { t } = useLanguage();
  const { phoneNumber, setPhoneNumber, pin, setPin, error, handleSubmission } = useSignInForm();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Logo */}
      <div className="mt-4">
        <img
          src={workInSiteLogo}
          alt="WorkInSite Logo"
          className="h-35 w-[100%] md:w-[100%]"
        />
      </div>

      {/* Form */}
      <div className="mt-6 space-y-4 ">

        <PhoneNumberField
          label={t('Phone Number')}
          inputValue={phoneNumber}
          setInputValue={setPhoneNumber}
          errorMessage={error.phoneNumber}
          required={true}
        />

        <PinField
          inputValue={pin}
          setInputValue={setPin}
          errorMessage={error.pin}
          required={true}
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-pin"
            className="md-unit underline"
            style={{ color: "var(--gray-color)" }}
          >
            {t('Forgot your PIN?')}
          </Link>
        </div>

        <Button
          onClick={handleSubmission}
          className="w-full h-10 bg-[var(--primary)] text-black font-semibold !rounded-[12px] shadow-md hover:bg-[var(--primary)] transition-opacity duration-300 hover:opacity-90 mt-2 cursor-pointer"
          style={{ borderRadius: "16px" }}
        >
          {t('Sign in')}
        </Button>

        <div className="flex items-center justify-center gap-1">
          <p className="text-sm mt-1" style={{ color: "var(--gray-color)" }}>
            {t('Create new account?')}
          </p>
          <Link to="/sign-up" className="mt-1 !text-black">
            {t('Sign up')}
          </Link>
        </div>

      </div>
    </div>
  );
};

export { SignInForm };