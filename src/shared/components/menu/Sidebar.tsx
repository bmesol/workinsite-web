import { Sheet, SheetContent } from "@/shared/components/ui/sheet";
import { useMenu } from "./useMenu";
import { LogOut, X, ChevronDown, ChevronUp } from "lucide-react";
import { MenuItems } from "./MenuItems";
import { useLocation, useNavigate } from "react-router-dom";
import { BaseUrls } from "@/shared/utils/UrlPages";
import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
import { useState } from "react";

type SidebarProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

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
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

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

  const isParentActive = (href: string, children?: { href: string }[]) => {
    if (location.pathname === href) return true;
    if (children?.some((child) => location.pathname === child.href)) return true;
    return false;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[300px] p-0 flex flex-col overflow-hidden [&>button]:hidden"
        style={{
          background: "var(--background)",
          borderLeft: "1px solid var(--border)",
        }}
      >
      {/* --------------------Profile-section-------------------------- */}
        <div
          className="relative flex items-center gap-3 px-4"
          style={{
            background: "var(--primary-side)",
            borderBottom: "1.5px solid var(--primary)",
            paddingTop: "22px",
            paddingBottom: "22px",
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

          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {userProfile?.name ? getInitials(userProfile.name) : "?"}
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold truncate">
                {userProfile?.name || "Loading..."}
              </span>
              <button
                onClick={() => handleNavigate(BaseUrls.Profile)}
                title="Profile"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <EditIcon />
              </button>
            </div>
            <span className="text-xs text-gray-500">
              {userProfile?.role?.name || "-"}
            </span>
          </div>
        </div>

       {/* ---------------------Menu-items------------------------------- */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {Object.entries(MenuItems).map(([href, item]) => {
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
                      handleNavigate(href);
                    }
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition"
                  style={{
                    background: isActive ? "var(--primary-side)" : "var(--card)",
                    border: isActive
                      ? "1.5px solid var(--primary)"
                      : "1px solid var(--border)",
                  }}
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-lg"
                    style={{
                      background: isActive ? "var(--primary)" : "var(--primary-side)",
                    }}
                  >
                    <item.icon
                      className="w-4 h-4"
                      style={{
                        color: isActive
                          ? "var(--primary-foreground)"
                          : "var(--secondary)",
                      }}
                    />
                  </div>

                  <span
                    className="text-sm flex-1"
                    style={{ fontWeight: isActive ? 600 : 500 }}
                  >
                    {item.label}
                  </span>

                  {hasChildren && (
                    <span style={{ color: "var(--secondary)" }}>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
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
                          style={{
                            background: isChildActive
                              ? "var(--primary-side)"
                              : "transparent",
                          }}
                        >
                          <div
                            style={{
                              width: "3px",
                              height: "18px",
                              borderRadius: "2px",
                              background: "var(--primary)",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            className="text-sm"
                            style={{
                              fontWeight: isChildActive ? 600 : 400,
                              color: isChildActive
                                ? "var(--primary)"
                                : "var(--foreground)",
                            }}
                          >
                            {child.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ---------------Logout------------------ */}
        <div
          className="px-3 py-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;