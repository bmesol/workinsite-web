import type { JSX } from "react";
import { Info } from "lucide-react";
import AadhaarIcon from "@/assets/icons/Aadhaar.webp";
import PanIcon from "@/assets/icons/pan.webp";
import GstIcon from "@/assets/icons/gst.webp";

const Icons: { [key: string]: JSX.Element } = {
  AADHAAR: <img src={AadhaarIcon} className="w-5 h-5 object-contain" />,
  PAN: <img src={PanIcon} className="w-5 h-5 object-contain" />,
  GST: <img src={GstIcon} className="w-5 h-5 object-contain" />,
  DEFAULT: <Info className="w-4 h-4" />,
};

export { Icons };