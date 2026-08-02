// import { Sheet, SheetContent } from "@/shared/components/ui/sheet";
// import { useMenu } from "./useMenu";
// import { LogOut, X, ChevronDown, ChevronUp, MapPin, Loader2, Check } from "lucide-react";
// import { MenuItems } from "./MenuItems";
// import { useLocation, useNavigate } from "react-router-dom";
// import { BaseUrls } from "@/shared/utils/UrlPages";
// import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
// import { useMemo, useState } from "react";
// import { useSidebarAttendance } from "./useSidebarAttendance";
// import { useLanguage } from "@/shared/hooks/useLanguageContext"; 

// type SidebarProps = {
//   open: boolean;
//   onOpenChange: (value: boolean) => void;
// };

// const getInitials = (name: string) =>
//   name
//     .split(" ")
//     .map((word) => word[0])
//     .join("")
//     .toUpperCase();

// const EditIcon = () => (
//   <svg
//     width="15"
//     height="15"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="var(--secondary)"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//   </svg>
// );

// const Sidebar = ({ open, onOpenChange }: SidebarProps) => {
//   const { userProfile } = useMenu();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { t, language } = useLanguage();
//   const isTamil = language === 'ta';
//   const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

//   const {
//     isSupervisor,
//     checkedIn,
//     address,
//     loading,
//     handleCheckIn,
//   } = useSidebarAttendance(open);

//   const userRoleId = AuthHelper.getUserProfile()?.role?.id ?? -1;

//   const filteredMenuItems = useMemo(() => {
//     return Object.entries(MenuItems).filter(([_, item]) =>
//       item.allowedUserRoles.includes(userRoleId),
//     );
//   }, [userRoleId]);

//   const handleNavigate = (href: string) => {
//     navigate(href);
//     onOpenChange(false);
//   };

//   const handleLogout = () => {
//     AuthHelper.logout();
//     onOpenChange(false);
//   };

//   const toggleDropdown = (href: string) => {
//     setOpenDropdowns((prev) => {
//       const isCurrentlyOpen = prev[href];
//       return isCurrentlyOpen ? {} : { [href]: true };
//     });
//   };

//   const isParentActive = (href: string, children?: { href: string }[]) => {
//     if (location.pathname === href) return true;
//     if (children?.some((child) => location.pathname === child.href)) return true;
//     return false;
//   };

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent
//         side="right"
//         className="w-[300px] p-0 flex flex-col overflow-hidden [&>button]:hidden"
//         style={{
//           background: "var(--background)",
//           borderLeft: "1px solid var(--border)",
//         }}
//       >
//         {/* Profile section */}
//         <div
//           className="relative flex flex-col gap-3 px-4"
//           style={{
//             background: "var(--primary-side)",
//             borderBottom: "1.5px solid var(--primary)",
//             paddingTop: "22px",
//             paddingBottom: "16px",
//           }}
//         >
//           <button
//             onClick={() => onOpenChange(false)}
//             style={{
//               position: "absolute",
//               top: "10px",
//               right: "10px",
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               color: "var(--gray-color)",
//             }}
//           >
//             <X className="w-4 h-4" />
//           </button>

//           <div className="flex items-center gap-3">
//             <div
//               className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
//               style={{
//                 background: "var(--primary)",
//                 color: "var(--primary-foreground)",
//               }}
//             >
//               {userProfile?.name ? getInitials(userProfile.name) : "?"}
//             </div>

//             <div className="flex flex-col flex-1 min-w-0">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-semibold truncate">
//                   {userProfile?.name || t('Loading...')}
//                 </span>
//                 <button
//                   onClick={() => handleNavigate(BaseUrls.Profile)}
//                   title={t('Profile')}
//                   style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}
//                 >
//                   <EditIcon />
//                 </button>
//               </div>
//               <span className="text-xs text-gray-500">
//                 {userProfile?.role?.name || "-"}
//               </span>
//             </div>
//           </div>

//           {isSupervisor && (
//             <div
//               className="flex items-center justify-between pt-3"
//               style={{ borderTop: "1px solid var(--border)" }}
//             >
//               <div className="flex flex-col gap-0.5">
//                 <span className="text-xs font-medium" style={{ color: "var(--secondary)" }}>
//                   {/* ✅ FIX 1: Attendance labels translate */}
//                   {checkedIn ? t('Attendance Marked') : t('Mark Attendance')}
//                 </span>
//                 {address && (
//                   <div className="flex items-start gap-1 mt-0.5">
//                     <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "var(--primary)" }} />
//                     <span className="text-xs leading-tight" style={{ color: "var(--gray-color)", maxWidth: "190px" }}>
//                       {address}
//                     </span>
//                   </div>
//                 )}
//               </div>
//               <button
//                 onClick={handleCheckIn}
//                 disabled={loading || checkedIn}
//                 style={{
//                   width: "26px",
//                   height: "26px",
//                   borderRadius: "7px",
//                   border: `2px solid ${checkedIn ? "#22C55E" : "var(--primary)"}`,
//                   background: checkedIn ? "#22C55E" : "transparent",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   cursor: checkedIn ? "default" : "pointer",
//                   flexShrink: 0,
//                   transition: "all 0.2s ease",
//                 }}
//               >
//                 {loading ? (
//                   <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "var(--primary)" }} />
//                 ) : (
//                   <Check className="w-3.5 h-3.5" style={{ color: checkedIn ? "#fff" : "transparent" }} />
//                 )}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Menu items */}
//         <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
//           {filteredMenuItems.map(([href, item]) => {
//             const hasChildren = item.children && item.children.length > 0;
//             const isActive = isParentActive(href, item.children);
//             const isOpen = openDropdowns[href] ?? false;

//             return (
//               <div key={href}>
//                 <div
//                   onClick={() => {
//                     if (hasChildren) {
//                       toggleDropdown(href);
//                     } else {
//                       handleNavigate(href);
//                     }
//                   }}
//                   className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition"
//                   style={{
//                     background: isActive ? "var(--primary-side)" : "var(--card)",
//                     border: isActive ? "1.5px solid var(--primary)" : "1px solid var(--border)",
//                   }}
//                 >
//                   <div
//                     className="w-8 h-8 flex items-center justify-center rounded-lg"
//                     style={{ background: isActive ? "var(--primary)" : "var(--primary-side)" }}
//                   >
//                     <item.icon
//                       className="w-4 h-4"
//                       style={{ color: isActive ? "var(--primary-foreground)" : "var(--secondary)" }}
//                     />
//                   </div>

//                   <span
//                     className="flex-1"
//                     style={{
//                       fontSize: isTamil ? '13px' : '14px',
//                       fontWeight: isActive ? (isTamil ? 700 : 600) : (isTamil ? 600 : 500),
//                     }}
//                   >
//                     {t(item.label)}
//                   </span>

//                   {hasChildren && (
//                     <span style={{ color: "var(--secondary)" }}>
//                       {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//                     </span>
//                   )}
//                 </div>

//                 {hasChildren && isOpen && (
//                   <div className="mt-1 ml-4 space-y-1">
//                     {item.children!.map((child) => {
//                       const isChildActive = location.pathname === child.href;
//                       return (
//                         <div
//                           key={child.href}
//                           onClick={() => handleNavigate(child.href)}
//                           className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition"
//                           style={{ background: isChildActive ? "var(--primary-side)" : "transparent" }}
//                         >
//                           <div style={{ width: "3px", height: "18px", borderRadius: "2px", background: "var(--primary)", flexShrink: 0 }} />

//                           <span
//                             style={{
//                               fontSize: isTamil ? '13px' : '14px',
//                               fontWeight: isChildActive ? (isTamil ? 700 : 600) : (isTamil ? 600 : 400),
//                               color: isChildActive ? "var(--primary)" : "var(--foreground)",
//                             }}
//                           >
//                             {t(child.label)}
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Logout */}
//         <div className="px-3 py-4" style={{ borderTop: "1px solid var(--border)" }}>
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
//             style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
//           >
//             <LogOut className="w-4 h-4" />
//             {/* ✅ FIX 4: Logout translate */}
//             {t('Logout')}
//           </button>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default Sidebar;


import { Sheet, SheetContent } from "@/shared/components/ui/sheet";
import { useMenu } from "./useMenu";
import { LogOut, X, ChevronDown, ChevronUp, ChevronLeft, MapPin, Loader2, Check, Moon, Globe } from "lucide-react";
import { MenuItems } from "./MenuItems";
import { useLocation, useNavigate } from "react-router-dom";
import { BaseUrls } from "@/shared/utils/UrlPages";
import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
import { useEffect, useMemo, useState } from "react";
import { useSidebarAttendance } from "./useSidebarAttendance";
import { useLanguage } from "@/shared/hooks/useLanguageContext";
import { useTheme } from "@/shared/context/ThemeContext";
import { ThemeSelector } from "@/shared/components/ThemeSelector/ThemeSelector";
import { LanguageSelector } from "@/shared/components/LanguageSelector/LanguageSelector";

type SidebarProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

type SidebarView = "menu" | "theme" | "language" | "site-picker";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const EditIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--secondary)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const Sidebar = ({ open, onOpenChange }: SidebarProps) => {
  const { userProfile } = useMenu();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isTamil = language === "ta";
  const languageLabels: Record<string, string> = { en: "English", ta: "Tamil" };
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [activeView, setActiveView] = useState<SidebarView>("menu");

  const {
    isSupervisor,
    checkedIn,
    address,
    loading,
    mySites,
    showSitePicker,
    handleCheckIn,
    handleSiteSelected,
    closeSitePicker,
  } = useSidebarAttendance(open);

  // Mirror site picker state into the sidebar view stack
  useEffect(() => {
    if (showSitePicker) setActiveView("site-picker");
  }, [showSitePicker]);

  const userRoleId = AuthHelper.getUserProfile()?.role?.id ?? -1;

  const filteredMenuItems = useMemo(() => {
    return Object.entries(MenuItems).filter(([_, item]) =>
      item.allowedUserRoles.includes(userRoleId),
    );
  }, [userRoleId]);

  const handleSheetOpenChange = (value: boolean) => {
    onOpenChange(value);
    if (!value) setActiveView("menu");
  };

  const handleNavigate = (href: string) => {
    navigate(href);
    onOpenChange(false);
  };

  const handleLogout = () => {
    AuthHelper.logout();
    onOpenChange(false);
  };

  const toggleDropdown = (href: string) => {
    setOpenDropdowns((prev) => {
      const isCurrentlyOpen = prev[href];
      return isCurrentlyOpen ? {} : { [href]: true };
    });
  };

  const getEffectiveHref = (href: string) => {
    if (href === "/dashboard") {
      return isSupervisor ? "/dashboard" : "/engineer-dashboard";
    }
    return href;
  };

  const isParentActive = (href: string, children?: { href: string }[]) => {
    const effective = getEffectiveHref(href);
    if (location.pathname === effective) return true;
    if (children?.some((child) => location.pathname === child.href)) return true;
    return false;
  };

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent
        side="right"
        className="w-[300px] p-0 flex flex-col overflow-hidden [&>button]:hidden"
        style={{
          background: "var(--background)",
          borderLeft: "1px solid var(--border)",
        }}
      >
        {activeView === "menu" ? (
          <>
            {/* Profile section */}
            <div
              className="relative flex flex-col gap-3 px-4"
              style={{
                background: "var(--primary-side)",
                borderBottom: "1.5px solid var(--primary)",
                paddingTop: "22px",
                paddingBottom: "16px",
              }}
            >
              <button
                onClick={() => onOpenChange(false)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--gray-color)",
                }}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  {userProfile?.name ? getInitials(userProfile.name) : "?"}
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">
                      {userProfile?.name || t("Loading...")}
                    </span>
                    <button
                      onClick={() => handleNavigate(BaseUrls.Profile)}
                      title={t("Profile")}
                      style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}
                    >
                      <EditIcon />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {userProfile?.role?.name || "-"}
                  </span>
                </div>
              </div>

              {isSupervisor && (
                <div
                  className="flex items-center justify-between pt-3"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium" style={{ color: "var(--secondary)" }}>
                      {checkedIn ? t("Attendance Marked") : t("Mark Attendance")}
                    </span>
                    {address && (
                      <div className="flex items-start gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                        <span className="text-xs leading-tight" style={{ color: "var(--gray-color)", maxWidth: "190px" }}>
                          {address}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleCheckIn}
                    disabled={loading || checkedIn}
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "7px",
                      border: `2px solid ${checkedIn ? "#22C55E" : "var(--primary)"}`,
                      background: checkedIn ? "#22C55E" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: checkedIn ? "default" : "pointer",
                      flexShrink: 0,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "var(--primary)" }} />
                    ) : (
                      <Check className="w-3.5 h-3.5" style={{ color: checkedIn ? "#fff" : "transparent" }} />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Menu items */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              {filteredMenuItems.map(([href, item]) => {
                const hasChildren = item.children && item.children.length > 0;
                const isActive = isParentActive(href, item.children);
                const isOpen = openDropdowns[href] ?? false;

                return (
                  <div key={href}>
                    <div
                      onClick={() => {
                        if (hasChildren) {
                          toggleDropdown(href);
                        } else {
                          handleNavigate(getEffectiveHref(href));
                        }
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition"
                      style={{
                        background: isActive ? "var(--primary-side)" : "var(--card)",
                        border: isActive ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                      }}
                    >
                      <div
                        className="w-8 h-8 flex items-center justify-center rounded-lg"
                        style={{ background: isActive ? "var(--primary)" : "var(--primary-side)" }}
                      >
                        <item.icon
                          className="w-4 h-4"
                          style={{ color: isActive ? "var(--primary-foreground)" : "var(--secondary)" }}
                        />
                      </div>

                      <span
                        className="flex-1"
                        style={{
                          fontSize: isTamil ? "13px" : "14px",
                          fontWeight: isActive ? (isTamil ? 700 : 600) : (isTamil ? 600 : 500),
                        }}
                      >
                        {t(item.label)}
                      </span>

                      {hasChildren && (
                        <span style={{ color: "var(--secondary)" }}>
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      )}
                    </div>

                    {hasChildren && isOpen && (
                      <div className="mt-1 ml-4 space-y-1">
                        {item.children!.map((child) => {
                          const isChildActive = location.pathname === child.href;
                          return (
                            <div
                              key={child.href}
                              onClick={() => handleNavigate(child.href)}
                              className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition"
                              style={{ background: isChildActive ? "var(--primary-side)" : "transparent" }}
                            >
                              <div style={{ width: "3px", height: "18px", borderRadius: "2px", background: "var(--primary)", flexShrink: 0 }} />

                              <span
                                style={{
                                  fontSize: isTamil ? "13px" : "14px",
                                  fontWeight: isChildActive ? (isTamil ? 700 : 600) : (isTamil ? 600 : 400),
                                  color: isChildActive ? "var(--primary)" : "var(--foreground)",
                                }}
                              >
                                {t(child.label)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              <span
                className="block px-2 pt-2 pb-1 text-[11px] font-semibold tracking-wide"
                style={{ color: "var(--gray-color)" }}
              >
                {t("SETTINGS")}
              </span>

              {/* Theme - opens theme layer */}
              <div
                onClick={() => setActiveView("theme")}
                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ background: "var(--primary-side)" }}
                >
                  <Moon className="w-4 h-4" style={{ color: "var(--secondary)" }} />
                </div>

                <span
                  className="flex-1"
                  style={{
                    fontSize: isTamil ? "13px" : "14px",
                    fontWeight: isTamil ? 600 : 500,
                  }}
                >
                  {t("Theme")}
                </span>

                <span
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{
                    background: theme.primaryColor,
                    border: "1.5px solid var(--border)",
                  }}
                />
              </div>

              {/* Language - opens language layer */}
              <div
                onClick={() => setActiveView("language")}
                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ background: "var(--primary-side)" }}
                >
                  <Globe className="w-4 h-4" style={{ color: "var(--secondary)" }} />
                </div>

                <span
                  className="flex-1"
                  style={{
                    fontSize: isTamil ? "13px" : "14px",
                    fontWeight: isTamil ? 600 : 500,
                  }}
                >
                  {t("Language")}
                </span>

                <span className="text-xs" style={{ color: "var(--gray-color)" }}>
                  {languageLabels[language] ?? language}
                </span>
              </div>
            </div>

            {/* Logout */}
            <div className="px-3 py-4" style={{ borderTop: "1px solid var(--border)" }}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                <LogOut className="w-4 h-4" />
                {t("Logout")}
              </button>
            </div>
          </>
        ) : activeView === "site-picker" ? (
          <>
            {/* Site picker header */}
            <div
              className="flex items-center gap-3 px-4"
              style={{
                background: "var(--primary-side)",
                borderBottom: "1.5px solid var(--primary)",
                paddingTop: "22px",
                paddingBottom: "16px",
              }}
            >
              <button
                onClick={() => { closeSitePicker(); setActiveView("menu"); }}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-base font-semibold">{t("Select Site")}</span>
            </div>

            {/* Site list */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              {mySites.map((site) => (
                <div
                  key={site.id}
                  onClick={() => { handleSiteSelected(site); setActiveView("menu"); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span className="flex-1 text-sm font-medium">{site.name}</span>
                </div>
              ))}
              {mySites.length === 0 && (
                <p className="text-sm text-center" style={{ color: "var(--gray-color)", paddingTop: "24px" }}>
                  {t("No sites assigned")}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Back header */}
            <div
              className="flex items-center gap-3 px-4"
              style={{
                background: "var(--primary-side)",
                borderBottom: "1.5px solid var(--primary)",
                paddingTop: "22px",
                paddingBottom: "16px",
              }}
            >
              <button
                onClick={() => setActiveView("menu")}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-base font-semibold">
                {activeView === "theme" ? t("Customize Theme") : t("App Language")}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeView === "theme" && <ThemeSelector />}
              {activeView === "language" && <LanguageSelector />}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;