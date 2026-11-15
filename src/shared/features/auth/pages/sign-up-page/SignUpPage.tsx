import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";
import workInSiteLogo from "@/assets/images/work-insite-logo.png";
import "@/shared/features/auth/pages/sign-up-page/SignUpPage.scss";
import { useState } from "react";
import { Footer } from "@/shared/components/footer/Footer";
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { NameField } from "@/shared/components/FormFields/NameField";
import { PhoneNumberField } from "@/shared/components/FormFields/PhoneNumberField";
import { GenericInputField } from "@/shared/components/FormFields/GenericInputField";
import { PinField } from "@/shared/components/FormFields/PinField";

interface SignUpErrors {
  name?: string;
  phone?: string;
  organization?: string;
  pin?: string;
  confirmPin?: string;
}

export const SignUpPage = () => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [errors, setErrors] = useState<SignUpErrors>({});

  const validateForm = () => {
    const newErrors: SignUpErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (phone.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!organization.trim()) {
      newErrors.organization = "Organization name is required";
    }

    if (!pin) {
      newErrors.pin = "PIN is required";
    } else if (pin.length !== 4) {
      newErrors.pin = "PIN must be 4 digits";
    }

    if (!confirmPin) {
      newErrors.confirmPin = "Confirm PIN is required";
    } else if (pin !== confirmPin) {
      newErrors.confirmPin = "PIN and Confirm PIN do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
  };
  return (
    <div>
      <div className="registration-container">
        <div className="main-content mt-18 flex-1 flex justify-center items-center p-4 ">
          <Card className="w-full max-w-md">
            <div className="grid  place-items-center ">
              <div className="w-[100px] h-[110px]  grid place-items-center ">
                <img src={workInSiteLogo} alt="" className="w-[80%] h-[100%]" />
              </div>
            </div>
            {/* <CardHeader className="grid place-items-center  mb-0">
               <CardTitle className="cardtitle mb-0">WorkInSite</CardTitle> 
               <CardDescription className="cardtitle">Signup</CardDescription> 
            </CardHeader> */}
            <CardContent>
              <form>
                <div className="flex flex-col gap-4">
                  <NameField
                    inputValue={name}
                    setInputValue={setName}
                    errorMessage={errors.name}
                    placeholder={t('Enter your name')}
                    required
                  />
                  <PhoneNumberField
                    inputValue={phone}
                    setInputValue={setPhone}
                    errorMessage={errors.phone}
                    required
                  />
                  <GenericInputField
                    label="Organisation Name"
                    inputValue={organization}
                    setInputValue={setOrganization}
                    errorMessage={errors.organization}
                    placeholder="Enter organization name"
                    noStartSpace
                    required
                  />
                  <PinField
                    inputValue={pin}
                    setInputValue={setPin}
                    errorMessage={errors.pin}
                    required
                  />
                  <PinField
                    label={t("Confirm PIN")}
                    inputValue={confirmPin}
                    setInputValue={setConfirmPin}
                    errorMessage={errors.confirmPin}
                    required
                  />
                  <Button
                    onClick={handleSubmit}
                    className="w-full h-10 bg-[var(--primary)] text-black
                            font-semibold rounded-[12px] shadow-md
                            transition-opacity duration-300
                            hover:opacity-9 mt-2"
                  >
                    Continue
                  </Button>
                </div>
                <div className="mt-2 text-center">
                  <p className="md-unit" style={{ color: "var(--gray-color)" }}>
                    Already have an account?{" "}
                    <Link to="/" className="md-unit mt-1 !text-black">
                      {t('Sign in')}
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    </div>
  );
};
