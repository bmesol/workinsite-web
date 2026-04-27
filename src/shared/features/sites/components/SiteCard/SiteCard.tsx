import { Card } from "@/shared/components/ui/card";
import { MapPin, Share2, Phone, ChevronRight, User, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { ContactTypes } from "../../../contacts/DTOs/ContactProps";
import type { Site } from "../../DTOs/SiteProps.ts";
import { SiteStatus } from "../../DTOs/SiteProps.ts";
import React, { useState } from "react";

const socialApps = [
  { label: "WhatsApp",  url: "https://web.whatsapp.com",  icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg",  bg: "#25D366" },
  { label: "Gmail",     url: "https://mail.google.com",   icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg",     bg: "#C5221F" },
  { label: "Instagram", url: "https://www.instagram.com", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg", bg: "#E1306C" },
  { label: "LinkedIn",  url: "https://www.linkedin.com",  icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg",  bg: "#0A66C2" },
  { label: "Facebook",  url: "https://www.facebook.com",  icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg",  bg: "#1877F2" },
  { label: "Telegram",  url: "https://web.telegram.org",  icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/telegram.svg",  bg: "#26A5E4" },
];

const SiteCard = (props: { site: Site }) => {
  const [shareOpen, setShareOpen] = useState(false);
  const [copyLabel, setCopyLabel] = useState<"Copy" | "Copied">("Copy");

  const phoneNumber = props.site.contact?.contactDetails?.find(
    (item) => item.contactType === ContactTypes.PHONE,
  )?.value;

  const googleLocation = props.site.googleLocation;

  const sqGrey: React.CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!googleLocation) return;
    navigator.clipboard.writeText(googleLocation);
    setShareOpen(true);
  };

  const handleCopyLink = () => {
    if (!googleLocation) return;
    navigator.clipboard.writeText(googleLocation);
    setCopyLabel("Copied");
  };

  return (
    <>
      <Card className="cursor-pointer w-full overflow-hidden">

        {/* Top Row */}
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <div style={sqGrey}>
              <MapPin className="h-4 w-4" style={{ color: "var(--primary)" }} />
            </div>
            <span className="text-lg font-semibold text-foreground">
              {props.site.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Button */}
            <div onClick={handleShare}>
              {googleLocation ? (
                <div style={{ ...sqGrey, cursor: "pointer" }} title="Share location">
                  <Share2 className="h-4 w-4" style={{ color: "var(--secondary)" }} />
                </div>
              ) : (
                <span style={{ ...sqGrey, opacity: 0.4, cursor: "not-allowed" }}>
                  <Share2 className="h-4 w-4" style={{ color: "var(--secondary)" }} />
                </span>
              )}
            </div>

            {/* Status Dot */}
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{
                background:
                  props.site.status === SiteStatus.YET_TO_START
                    ? "var(--warning-color)"
                    : props.site.status === SiteStatus.WORKING
                      ? "var(--success-color)"
                      : props.site.status === SiteStatus.HOLD
                        ? "var(--danger-color)"
                        : props.site.status === SiteStatus.COMPLETED
                          ? "var(--complete-color)"
                          : "var(--gray-color)",
              }}
            />
          </div>
        </div>

        <hr className="border-border mx-3 py-0" />

        {/* Bottom Row */}
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <div style={sqGrey}>
              <User className="h-4 w-4" style={{ color: "var(--secondary)" }} />
            </div>
            <span className="text-sm" style={{ color: "var(--gray-color)" }}>
              {props.site.contact?.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Phone */}
            <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              {phoneNumber ? (
                <a
                  href={`tel:${phoneNumber}`}
                  style={{ ...sqGrey, cursor: "pointer" }}
                  title={phoneNumber}
                >
                  <Phone className="h-4 w-4" style={{ color: "var(--secondary)" }} />
                </a>
              ) : (
                <span style={{ ...sqGrey, cursor: "default", opacity: 0.4 }}>
                  <Phone className="h-4 w-4" style={{ color: "var(--secondary)" }} />
                </span>
              )}
            </div>

            {/* ChevronRight */}
            <ChevronRight className="h-4 w-4" style={{ color: "#888" }} />
          </div>
        </div>

      </Card>

      {/* Share Dialog */}
      <Dialog
        open={shareOpen}
        onOpenChange={(val) => {
          setShareOpen(val);
          if (!val) setCopyLabel("Copy");
        }}
      >
        <DialogContent className="max-w-sm" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Share Link</DialogTitle>
          </DialogHeader>

          {/* Social Icons */}
          <div className="grid grid-cols-3 gap-4 place-items-center py-2">
            {socialApps.map((app) => (
              <div
                key={app.label}
                className="cursor-pointer"
                onClick={() => window.open(app.url, "_blank")}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: app.bg }}
                >
                  <img src={app.icon} alt={app.label} className="w-6 h-6 invert" />
                </div>
              </div>
            ))}
          </div>

          {/* URL + Copy */}
          <div className="flex justify-center mt-2">
            <div className="border px-3 py-2 text-sm text-muted-foreground max-w-[180px] truncate">
              {googleLocation && googleLocation.length > 15
                ? googleLocation.slice(0, 25) + "..."
                : googleLocation}
            </div>
            <div
              className="border px-3 py-2 text-sm cursor-pointer flex items-center gap-1.5 hover:bg-muted transition-colors"
              onClick={handleCopyLink}
            >
              {copyLabel === "Copied"
                ? <><Check className="h-3.5 w-3.5" />Copied</>
                : <><Copy className="h-3.5 w-3.5" />Copy</>
              }
            </div>
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
};

export { SiteCard };