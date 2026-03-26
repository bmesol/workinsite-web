import { Navbar } from "@/shared/components/navbar/Navbar";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import workInSiteLogo from "@/assets/images/work-insite-logo.png";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import "@/shared/features/auth/containers/sign-up-page/SignUpPage.scss";
import { useState } from "react";
import { Footer } from "@/shared/components/footer/Footer";

export const SignUpPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};

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

    console.log({
      name,
      phone,
      organization,
      pin,
      confirmPin,
    });
  };
  return (
    <div>
      <div className="registration-container">
        <Navbar />
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
                  <div className="grid gap-2">
                    <Label htmlFor="name">
                      Name<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">
                      Phone Number<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, ""))
                      }
                      maxLength={10}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="Orhanization">
                      Organisation Name<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="text"
                      placeholder="Enter organization name"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />
                    {errors.organization && (
                      <p className="text-red-500 text-sm">
                        {errors.organization}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">
                      PIN<span className="text-red-500">*</span>
                    </Label>
                    <InputOTP
                      type="password"
                      value={pin}
                      onChange={(value) => setPin(value)}
                      maxLength={4}
                      pattern={REGEXP_ONLY_DIGITS}
                      placeholder="*"
                    >
                      <InputOTPGroup className="w-full gap-4 mt-1 ">
                        {[0, 1, 2, 3].map((item) => (
                          <InputOTPSlot
                            key={item}
                            index={item}
                            className="otp-slot-primary w-[150px] md:w-[100px] lg:w-[100px] h-10 text-lg box-border border
                           hover:!border hover:!border-[var(--primary-color)] focus-visible:!border-2 focus-visible:!border-[var(--primary-color)]
                           focus-visible:!ring-1 focus-visible:!ring-offset-0"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    {errors.pin && (
                      <p className="text-red-500 text-sm">{errors.pin}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">
                      Confirm PIN<span className="text-red-500">*</span>
                    </Label>
                    <InputOTP
                      value={confirmPin}
                      onChange={(value) => setConfirmPin(value)}
                      maxLength={4}
                      pattern={REGEXP_ONLY_DIGITS}
                      placeholder="*"
                    >
                      <InputOTPGroup className="w-full gap-4 mt-1">
                        {[0, 1, 2, 3].map((item) => (
                          <InputOTPSlot
                            key={item}
                            index={item}
                            className="otp-slot-primary w-[150px] md:w-[100px] lg:w-[100px] h-10 text-lg box-border border
                            hover:!border hover:!border-[var(--primary-color)] focus-visible:!border-2 
                            focus-visible:!border-[var(--primary-color)]
                            focus-visible:!ring-1 focus-visible:!ring-offset-0"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    {errors.confirmPin && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPin}
                      </p>
                    )}
                  </div>
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
                      Sign in
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
