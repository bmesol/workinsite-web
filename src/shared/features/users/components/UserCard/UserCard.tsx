import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Card } from "@/shared/components/ui/card";
import { Phone, Briefcase } from "lucide-react";
import type { UserCardProps } from "./DTOs";

const UserCard = (props: UserCardProps) => {
  const { name, imgURL, role, phoneNumber, isActive } = props;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="w-full flex flex-row items-center gap-4 p-4 cursor-pointer hover:shadow-sm transition-shadow">
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
        {/* Status Dot */}
        <span
          className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white"
          style={{
            background: isActive
              ? "var(--success-color)"
              : "var(--danger-color)",
          }}
        />
      </div>

      {/* User Info */}
      <div className="flex flex-col min-w-0 gap-1">
        <span className="font-semibold text-sm text-black">{name}</span>

        <div className="flex items-center gap-1">
          <Briefcase className="h-3 w-3 text-black" />
          <span className="text-xs text-black">{role}</span>
        </div>

        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Phone className="h-3 w-3 text-black" />
          <a
            href={`tel:${phoneNumber}`}
            className="text-xs text-black hover:underline"
          >
            {phoneNumber}
          </a>
        </div>
      </div>
    </Card>
  );
};

export { UserCard };
