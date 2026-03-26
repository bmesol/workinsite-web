import workInSiteLogo from "@/assets/images/work-insite-logo.png";
import { Input } from "@/shared/components/ui/input";
import { Link } from "react-router-dom";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/shared/components/ui/button";
import { useSignInForm } from "./useSignInForm";


const SignInForm = () => {
  const { phoneNumber, setPhoneNumber, pin, setPin, error, handleSubmission } =
    useSignInForm();



    
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
      <div className="mt-6 space-y-4 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[50%]  ">
        <div>
          <label
            className="text-sm font-medium w-[100%] text-md"
            style={{ fontSize: "var(--md-unit)" }}
          >
            Phone Number <span className="text-red-500">*</span>
          </label>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="
             w-full mt-2 h-10
             border border-[1px] border-gray-300 
             hover:border-[var(--primary)]
             focus-visible:ring-1 focus-visible:ring-[var(--primary)]
             focus-visible:ring-offset-0"
            placeholder="Phone Number"
          />
          {error.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{error.phoneNumber}</p>
          )}
        </div>

        <div>
          <label
            className="text-sm font-medium text-md"
            style={{ fontSize: "var(--md-unit)" }}
          >
            PIN <span className="text-red-500 ">*</span>
          </label>
          <InputOTP
            value={pin}
            onChange={setPin}
            maxLength={4}
            pattern={REGEXP_ONLY_DIGITS}
            placeholder="*"
          >
            <InputOTPGroup className="w-full mt-2 gap-2">
              {[0, 1, 2, 3].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="
                  otp-slot-primary
                  w-[150px] md:w-[100px] lg:w-[100px]
                  h-10 text-lg box-border
                  border border-[1px] border-gray-300
                  hover:border-[var(--primary)]
                  focus-visible:border-transparent
                  focus-visible:ring-1
                  focus-visible:ring-[var(--primary)]
                  focus-visible:ring-offset-0
                  focus-visible:shadow-none"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {error.pin && (
            <p className="text-red-500 text-sm mt-1">{error.pin}</p>
          )}
        </div>
        <div className="flex justify-end">
          <Link
            to="/forgot-pin"
            className="md-unit underline" style={{ color: "var(--gray-color)" }}
          >
            Forgot your PIN?
          </Link>
        </div>

        <Button
          onClick={handleSubmission}
          className="w-[100%] h-10 bg-[var(--primary)] text-black font-semibold !rounded-[12px] shadow-md hover:bg-[var(--primary)] 
                    transition-opacity duration-300
                    hover:opacity-9 mt-2"
          style={{ borderRadius: "16px" }}
        >
          Sign in
        </Button>
        <div className="flex items-center justify-center gap-1">
          <p
            className="text-sm md-unit mt-1"
            style={{ color: "var(--gray-color)" }}
          >
            Create new account?
          </p>

          <Link to="/sign-up" className="md-unit mt-1 !text-black">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export { SignInForm };
