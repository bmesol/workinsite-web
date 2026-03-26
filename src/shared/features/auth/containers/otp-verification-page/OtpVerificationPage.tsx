import { Footer } from "@/shared/components/footer/Footer";
import { Navbar } from "@/shared/components/navbar/Navbar";
import { Button } from "@/shared/components/ui/button";
import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { Label } from "@/shared/components/ui/label";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp"

export const OtpVerificationPage = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  

  useEffect(() => {
    const savedPhone = localStorage.getItem("resetPhone");
    if (savedPhone) {
      setPhone(savedPhone);
    }
  }, []);
  return (
    <div>
      <Navbar></Navbar>
      <div className="min-h-[70vh] md:min-h-[90vh] lg:min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle style={{fontSize:'22px'}}>OTP Verification</CardTitle>
              <CardDescription
                className="md-unit"
                style={{ color: "var(--gray-color)" }}
              >
                Verification code sent to <br />
                
                  {phone ? `+91 ${phone}` : "your number"}
               
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <div>
                      <Label htmlFor="email">
                        PIN<span className="text-red-500">*</span>
                      </Label>
                         <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                         value={otp}
                         onChange={(value) => setOtp(value)}>
                         <InputOTPGroup className="w-full gap-2 mt-1 ">
                        {[0, 1, 2, 3, 4, 5].map((item) => (
                          <InputOTPSlot
                            key={item}
                            index={item}
                            className="otp-slot-primary w-[50px] sm:w-[50px] md:w-[52px] lg:w-[50px] h-10 text-lg box-border border
                           hover:!border hover:!border-[var(--primary-color)] focus-visible:!border-2 focus-visible:!border-[var(--primary-color)]
                           focus-visible:!ring-1 focus-visible:!ring-offset-0"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    </div>
                  </div>
                </div>
              </form>
              <CardAction>
                <Button variant="link" className="no-global-btn">Resend OTP</Button>
              </CardAction>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                disabled={otp.length !== 6}
                type="button"
                className="w-full h-10 bg-[var(--primary)] text-black
               font-semibold rounded-[12px] shadow-md
                transition-opacity duration-100
                hover:opacity-90 mt-1"
              >
                Verify
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};
