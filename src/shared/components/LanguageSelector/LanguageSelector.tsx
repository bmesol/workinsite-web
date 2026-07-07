// src/shared/components/LanguageSelector/LanguageSelector.tsx
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const languageMeta = {
  en: {
    selectLanguageLabel: "Select Language", // shown when English is active
    ownName: "English",
  },
  ta: {
    selectLanguageLabel: "மொழி தேர்வு",      // "Select Language" in Tamil
    ownName: "தமிழ்",
  },
} as const;

type LangCode = keyof typeof languageMeta;

export const LanguageSelector = () => {
  const { language, setAppLanguage } = useLanguage();

  const current = (language as LangCode) ?? "en";
  const target: LangCode = current === "en" ? "ta" : "en";

  return (
    <div
      className="flex items-stretch overflow-hidden select-none"
      style={{ backgroundColor: "var(--secondary)" }}
    >
      {/* Label reflects the currently active language */}
      <span
        className="flex items-center px-2.5 py-1 font-medium whitespace-nowrap"
        style={{
          color: "var(--secondary-bg-text)",
          fontSize: current === "ta" ? "10px" : "12px",
        }}
      >
        {languageMeta[current].selectLanguageLabel}
      </span>

      {/* Box always shows the OTHER language — tap to switch to it */}
      <button
        type="button"
        onClick={() => setAppLanguage(target)}
        className="px-2.5 py-1 font-semibold hover:brightness-95 active:brightness-90 transition"
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--primary-bg-text)",
          fontSize: target === "ta" ? "10px" : "12px",
        }}
      >
        {languageMeta[target].ownName}
      </button>
    </div>
  );
};