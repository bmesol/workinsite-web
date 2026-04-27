import gpayIcon from "@/assets/icons/google-pay.webp";
import phonePeIcon from "@/assets/icons/phonepe.webp";
import upiIcon from "@/assets/icons/upi.webp";
import { Info } from "lucide-react";
import type { JSX } from "react";

const Icons: { [key: string]: JSX.Element } = {
  GPAY: <img src={gpayIcon} alt="GPay" className="h-5 w-5 object-contain" />,
  PHONEPE: <img src={phonePeIcon} alt="PhonePe" className="h-5 w-5 object-contain" />,
  UPI_ID: <img src={upiIcon} alt="UPI" className="h-5 w-5 object-contain" />,
  DEFAULT: <Info className="h-4 w-4 text-muted-foreground" />,
};

export { Icons };