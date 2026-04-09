import { Phone, Mail, MapPin, Info } from "lucide-react"; 
import type { JSX } from "react";

const Icons: { [key: string]: JSX.Element } = {
  Phone: <Phone className="h-4 w-4 text-black" />,
  Email: <Mail className="h-4 w-4 text-black" />,
  Address: <MapPin className="h-4 w-4 text-black" />,
  DEFAULT: <Info className="h-4 w-4 text-black" />,
};

export { Icons };