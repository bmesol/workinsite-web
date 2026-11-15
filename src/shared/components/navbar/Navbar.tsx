import { useState } from "react";
import workInSiteLogo from "@/assets/images/work-insite-logo.png";
import { MenuBar } from "@/shared/components/menu/Menubar";
import Sidebar from "@/shared/components/menu/Sidebar";
import { NotificationBell } from "@/shared/features/notifications/components/NotificationBell";


export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="
          fixed top-0 left-0 z-50 w-full
          flex items-center justify-between
          px-6 h-18 bg-white shadow-md
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={workInSiteLogo} alt="logo" className="h-12 w-auto" />
          <span className="text-[26px] font-semibold">
            WorkInSite
          </span>
        </div>

        {/* Right side: Notification Bell + Menu icon */}
        <div className="flex items-center gap-4">
          <NotificationBell />
          <MenuBar onOpen={() => setOpen(true)} />
        </div>
      </nav>

      <Sidebar open={open} onOpenChange={setOpen} />
    </>
  );
};