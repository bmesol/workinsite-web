// import { useState, useRef, useEffect } from "react";
// import { useTheme } from "@/shared/context/ThemeContext";
// import { colorCombinations } from "@/shared/utils/color";

// export const ThemeSelector = () => {
//   const { theme, setTheme } = useTheme();
//   const [open, setOpen] = useState(false);
//   const wrapperRef = useRef<HTMLDivElement>(null);

//   // close on outside click
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const isActive = (primary: string) =>
//     theme.primaryColor.toLowerCase() === primary.toLowerCase();

//   return (
//     <div ref={wrapperRef} className="relative select-none">
//       {/* Trigger — swatch of the active theme */}
//       <button
//         type="button"
//         onClick={() => setOpen((v) => !v)}
//         className="flex items-center gap-2 px-2.5 py-1 hover:brightness-95 active:brightness-90 transition"
//         style={{ backgroundColor: "var(--secondary)" }}
//       >
//         <span
//           className="h-4 w-4 rounded-full border border-white/40"
//           style={{ backgroundColor: theme.primaryColor }}
//         />
//         <span
//           className="text-xs font-medium whitespace-nowrap"
//           style={{ color: "var(--secondary-bg-text)" }}
//         >
//           Theme
//         </span>
//       </button>

//       {/* Dropdown panel */}
//       {open && (
//         <div
//           className="absolute right-0 mt-2 w-48 rounded-md border bg-[var(--card)] p-2 shadow-lg z-50"
//           style={{ borderColor: "var(--border)" }}
//         >
//           <div className="grid grid-cols-5 gap-2">
//             {colorCombinations.map((combo, index) => (
//               <button
//                 key={index}
//                 type="button"
//                 title={combo.primaryColor}
//                 onClick={() => {
//                   setTheme(combo);
//                   setOpen(false);
//                 }}
//                 className="h-7 w-7 rounded-full transition hover:scale-110"
//                 style={{
//                   backgroundColor: combo.primaryColor,
//                   boxShadow: isActive(combo.primaryColor)
//                     ? `0 0 0 2px var(--card), 0 0 0 4px ${combo.primaryColor}`
//                     : "none",
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import { useTheme } from "@/shared/context/ThemeContext";
import { colorCombinations } from "@/shared/utils/color";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const { t, language } = useLanguage();
  const isTamil = language === "ta";

  const isActive = (primary: string) =>
    theme.primaryColor.toLowerCase() === primary.toLowerCase();

  return (
    <div className="px-1">
      <h3
        className="font-semibold mb-3"
        style={{ fontSize: isTamil ? "12px" : "14px", color: "var(--gray-color)" }}
      >
        {t('Choose a Theme')}
      </h3>

      <div className="grid grid-cols-4 gap-4">
        {colorCombinations.map((combo, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setTheme(combo)}
            className="relative overflow-hidden transition"
            style={{
              border: isActive(combo.primaryColor)
                ? "2px solid var(--foreground)"
                : "1px solid var(--border)",
              aspectRatio: "1 / 0.7",
              padding: 0,
              cursor: "pointer",
            }}
          >
            {index === 0 && (
              <span
                className="absolute top-0 right-0 text-[9px] font-medium px-1.5 py-0.5 rounded-bl-xs"
                style={{ background: "#fff", color: "#000" }}
              >
                Default
              </span>
            )}

            <div style={{ height: "55%", background: combo.primaryColor }} />

            <div className="flex" style={{ height: "45%" }}>
              <div style={{ flex: 1, background: "#111111" }} />
              <div style={{ flex: 1, background: "#ffffff" }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};