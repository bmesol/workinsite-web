import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card } from "@/shared/components/ui/card";
import { Phone, Mail, Trash2 } from "lucide-react";
import type { ContactCardProps } from "./DTOs";

const ContactCard = (props: ContactCardProps) => {
  const { name, imgURL, phone, email, onDelete } = props;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="w-full flex flex-row justify-between items-center p-4 cursor-pointer hover:shadow-sm transition-shadow">

      <div className="flex items-center gap-4 overflow-x-auto">

        <div className="relative flex-shrink-0">
          <Avatar className="h-16 w-16 rounded-xl">
            <AvatarImage src={imgURL} alt={name} />
            <AvatarFallback
              className="text-lg font-bold rounded-xl"
              style={{ background: "var(--primary)", color: "var(--secondary)" }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Contact Details */}
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-semibold text-base text-black">{name}</span>

          {phone && (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Phone className="h-3 w-3 text-black" />
              <a href={`tel:${phone}`} className="text-sm text-black hover:underline">
                {phone}
              </a>
            </div>
          )}

          {email && (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Mail className="h-3 w-3 text-black" />
              <a href={`mailto:${email}`} className="text-sm text-black hover:underline">
                {email}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Right — Delete */}
      <div
        className="self-center ml-2 shrink-0 p-2 rounded-md hover:bg-destructive/10 transition-colors"
        onClick={(e: React.MouseEvent) => onDelete(e)}
      >
        <Trash2 className="h-5 w-5 text-destructive" />
      </div>
    </Card>
  );
};

export { ContactCard };