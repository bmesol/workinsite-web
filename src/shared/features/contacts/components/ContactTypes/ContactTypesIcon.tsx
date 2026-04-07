import { Phone, Mail, MapPin, Info } from "lucide-react"; 
import type { JSX } from "react";

const Icons: { [key: string]: JSX.Element } = {
  Phone: <Phone className="h-4 w-4 text-muted-foreground" />,
  Email: <Mail className="h-4 w-4 text-muted-foreground" />,
  Address: <MapPin className="h-4 w-4 text-muted-foreground" />,
  DEFAULT: <Info className="h-4 w-4 text-muted-foreground" />,
};

export { Icons };