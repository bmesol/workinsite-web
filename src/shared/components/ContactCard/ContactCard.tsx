import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Card } from "@/shared/components/ui/card";
import { Phone, Mail, Trash2, Briefcase, Users } from "lucide-react";
import type { ContactCardProps } from "./DTOs";

const ContactCard = (props: ContactCardProps) => {
  const {
    name,
    displayName,
    imgURL,
    phone,
    email,
    workType,
    workerRole,
    onDelete,
    onPress,
    subDetails,
  } = props;

  const initials = (name ?? "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      className="w-full flex flex-row justify-between items-center p-4 cursor-pointer hover:shadow-sm transition-shadow"
      onClick={onPress}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <Avatar className="h-16 w-16 rounded-xl">
            <AvatarImage src={imgURL} alt={name} />
            <AvatarFallback
              className="text-lg font-bold rounded-xl"
              style={{
                background: "var(--primary)",
                color: "var(--secondary)",
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Contact Details */}
        <div className="flex flex-col gap-1 min-w-0">
          {/* Name */}
          {name && (
            <span className="font-semibold text-base text-black">
              {displayName ?? name}
            </span>
          )}

          {subDetails?.map((detail, index) => (
            <div key={index} className="flex items-center gap-1">
              <detail.icon className="h-3 w-3 text-black shrink-0" />
              <span className="text-sm text-black truncate">{detail.text}</span>
            </div>
          ))}

          {phone && (
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="h-3 w-3 text-black" />
              <a
                href={`tel:${phone}`}
                className="text-sm text-black hover:underline"
              >
                {phone}
              </a>
            </div>
          )}

          {email && (
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="h-3 w-3 text-black" />
              <a
                href={`mailto:${email}`}
                className="text-sm text-black hover:underline"
              >
                {email}
              </a>
            </div>
          )}

          {/* workType with icon — same as mobile */}
          {workType && (
            <div className="flex items-center gap-1">
              <Briefcase className="h-3 w-3 text-black" />
              <span className="text-sm text-black">{workType}</span>
            </div>
          )}

          {/* workerRole with icon — same as mobile */}
          {workerRole && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-black" />
              <span className="text-sm text-black">{workerRole}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right — Delete */}
      <div
        className="self-center ml-2 shrink-0 p-2 rounded-md hover:bg-destructive/10 transition-colors"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onDelete(e);
        }}
      >
       <Trash2 className="h-5 w-5" style={{ color: 'var(--danger-color)' }} />
      </div>
    </Card>
  );
};

export { ContactCard };
