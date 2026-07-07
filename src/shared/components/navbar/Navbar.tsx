import { useState } from "react";
import { Label } from "@/shared/components/ui/label";
import workInSiteLogo from "@/assets/images/work-insite-logo.png";
import { MenuBar } from "@/shared/components/menu/Menubar";
import Sidebar from "@/shared/components/menu/Sidebar";
import { LanguageSelector } from "@/shared/components/LanguageSelector/LanguageSelector";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
        className="
          fixed top-0 left-0 z-50 w-full
          flex items-center justify-between
          px-6 h-18 bg-white
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={workInSiteLogo} alt="logo" className="h-12 w-auto" />
          <Label style={{ fontSize: "26px", fontWeight: "600" }}>
            WorkInSite
          </Label>
        </div>

        {/* ✅ Right side: Language Selector + Menu icon */}
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <MenuBar onOpen={() => setOpen(true)} />
        </div>
      </nav>

      <Sidebar open={open} onOpenChange={setOpen} />
    </>
  );
};