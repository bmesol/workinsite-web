import { Footer } from '@/shared/components/footer/Footer';
import { Navbar } from '@/shared/components/navbar/Navbar';
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import {
   Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from '@/shared/hooks/useLanguageContext';



export const ForgetPinPage = () => {
 const { t } = useLanguage();
 const navigate = useNavigate();
const [phone, setPhone] = useState("");
const [error, setError] = useState("");

const handleSendOtp = () => {
  if (!phone) {
    setError("Phone number is required");
    return; 
  }

  if (phone.length !== 10) {
    setError("Enter valid phone number");
    return;
  }

  setError("");


  localStorage.setItem("resetPhone", phone);

  navigate("/otp-verification");
};

  return (
    <div>
    <Navbar></Navbar>
    <div className='min-h-[70vh] md:min-h-[90vh] lg:min-h-screen flex items-center justify-center'>
       
        <div className='w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        <Card className="w-full ">
      <CardHeader className='text-center'>
        <CardTitle>Reset your PIN</CardTitle>
        <CardDescription className='md-unit' style={{ color: "var(--gray-color)" }}>
          Enter your registered phone number. We will send you a code to reset your PIN.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="Phone Number">{t('Phone Number')}</Label>
              <Input
                value={phone}
               onChange={(e) => setPhone(e.target.value)}
               placeholder={t('Enter phone number')}
              />
            </div>
           </div>
           {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </form>
         <CardAction>
           <Link to="/" className="md-unit underline">
             {t('Sign in')}
            </Link>
        </CardAction> 
      </CardContent>
      <CardFooter className="flex-col gap-2">
       <Button
        onClick={handleSendOtp}
        type="button"
        className="w-full h-10 bg-[var(--primary)] text-black
        font-semibold rounded-[12px] shadow-md
        transition-opacity duration-100
        hover:opacity-90 mt-1">
        Send Reset Code
       </Button>

      
      </CardFooter>
    </Card>
    </div>
      
    </div>
     <Footer />
    </div>
  )
}
