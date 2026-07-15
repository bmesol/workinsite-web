// import { useLanguage } from "@/shared/hooks/useLanguageContext";

// const languageMeta = {
//   en: {
//     selectLanguageLabel: "Select Language",
//     ownName: "English",
//   },
//   ta: {
//     selectLanguageLabel: "மொழி தேர்வு",      
//     ownName: "தமிழ்",
//   },
// } as const;

// type LangCode = keyof typeof languageMeta;

// export const LanguageSelector = () => {
//   const { language, setAppLanguage } = useLanguage();

//   const current = (language as LangCode) ?? "en";
//   const target: LangCode = current === "en" ? "ta" : "en";

//   return (
//     <div
//       className="flex items-stretch overflow-hidden select-none"
//       style={{ backgroundColor: "var(--secondary)" }}
//     >
//       {/* Label reflects the currently active language */}
//       <span
//         className="flex items-center px-2.5 py-1 font-medium whitespace-nowrap"
//         style={{
//           color: "var(--secondary-bg-text)",
//           fontSize: current === "ta" ? "10px" : "12px",
//         }}
//       >
//         {languageMeta[current].selectLanguageLabel}
//       </span>

//       {/* Box always shows the OTHER language — tap to switch to it */}
//       <button
//         type="button"
//         onClick={() => setAppLanguage(target)}
//         className="px-2.5 py-1 font-semibold hover:brightness-95 active:brightness-90 transition"
//         style={{
//           backgroundColor: "var(--primary)",
//           color: "var(--primary-bg-text)",
//           fontSize: target === "ta" ? "10px" : "12px",
//         }}
//       >
//         {languageMeta[target].ownName}
//       </button>
//     </div>
//   );
// };


import { useLanguage } from "@/shared/hooks/useLanguageContext";

export const LanguageSelector = () => {
  const { language, setAppLanguage, t } = useLanguage();
  const isTamil = language === "ta";

  const options: { code: "en" | "ta"; label: string }[] = [
    { code: "en", label: "English" },
    { code: "ta", label: "தமிழ்" },
  ];

  return (
    <div className="px-1">
      <h3
        className="font-semibold mb-3"
        style={{ fontSize: isTamil ? "12px" : "14px", color: "var(--gray-color)" }}
      >
        {t('App Language')}
      </h3>

      <div className="flex items-center gap-6">
        {options.map((opt) => {
          const selected = language === opt.code;
          return (
            <label
              key={opt.code}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setAppLanguage(opt.code)}
            >
              <span
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 18, height: 18, border: "2px solid var(--primary)" }}
              >
                {selected && (
                  <span
                    className="rounded-full"
                    style={{ width: 10, height: 10, background: "var(--primary)" }}
                  />
                )}
              </span>
              <span style={{ fontSize: isTamil ? "12px" : "14px", color: "var(--foreground)" }}>
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};