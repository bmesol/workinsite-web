// // import { useState, useRef, useEffect } from "react";
// // import { useTheme } from "@/shared/context/ThemeContext";
// // import { colorCombinations } from "@/shared/utils/color";

// // export const ThemeSelector = () => {
// //   const { theme, setTheme } = useTheme();
// //   const [open, setOpen] = useState(false);
// //   const wrapperRef = useRef<HTMLDivElement>(null);

// //   // close on outside click
// //   useEffect(() => {
// //     const handleClickOutside = (e: MouseEvent) => {
// //       if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
// //         setOpen(false);
// //       }
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   const isActive = (primary: string) =>
// //     theme.primaryColor.toLowerCase() === primary.toLowerCase();

// //   return (
// //     <div ref={wrapperRef} className="relative select-none">
// //       {/* Trigger — swatch of the active theme */}
// //       <button
// //         type="button"
// //         onClick={() => setOpen((v) => !v)}
// //         className="flex items-center gap-2 px-2.5 py-1 hover:brightness-95 active:brightness-90 transition"
// //         style={{ backgroundColor: "var(--secondary)" }}
// //       >
// //         <span
// //           className="h-4 w-4 rounded-full border border-white/40"
// //           style={{ backgroundColor: theme.primaryColor }}
// //         />
// //         <span
// //           className="text-xs font-medium whitespace-nowrap"
// //           style={{ color: "var(--secondary-bg-text)" }}
// //         >
// //           Theme
// //         </span>
// //       </button>

// //       {/* Dropdown panel */}
// //       {open && (
// //         <div
// //           className="absolute right-0 mt-2 w-48 rounded-md border bg-[var(--card)] p-2 shadow-lg z-50"
// //           style={{ borderColor: "var(--border)" }}
// //         >
// //           <div className="grid grid-cols-5 gap-2">
// //             {colorCombinations.map((combo, index) => (
// //               <button
// //                 key={index}
// //                 type="button"
// //                 title={combo.primaryColor}
// //                 onClick={() => {
// //                   setTheme(combo);
// //                   setOpen(false);
// //                 }}
// //                 className="h-7 w-7 rounded-full transition hover:scale-110"
// //                 style={{
// //                   backgroundColor: combo.primaryColor,
// //                   boxShadow: isActive(combo.primaryColor)
// //                     ? `0 0 0 2px var(--card), 0 0 0 4px ${combo.primaryColor}`
// //                     : "none",
// //                 }}
// //               />
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

 'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useTheme, type Theme } from '@/shared/context/ThemeContext';
import { colorCombinations } from '@/shared/utils/color';
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { Button } from '@/shared/components/ui/button';

/* ------------------------------------------------------------------ */
/*  Sample data for the live preview panel — mirrors the actual        */
/*  WorkInSite dashboard (welcome strip, glance stats, sites list) so  */
/*  the person previews the real product, not a generic mockup.        */
/* ------------------------------------------------------------------ */
const glanceStats = [
  { label: 'Active Sites', value: '9' },
  { label: 'Workers Today', value: '0' },
  { label: 'Wages Today', value: '₹0' },
  { label: 'Open Tasks', value: '6' },
];

const previewSites = [
  { name: 'Erode sites', status: 'Working' },
  { name: 'Chennai Sites', status: 'Working' },
  { name: 'Dharmapuri', status: 'Completed' },
];

function sameTheme(a: Theme, b: Theme) {
  return (
    a.primaryColor.toLowerCase() === b.primaryColor.toLowerCase() &&
    a.secondaryColor.toLowerCase() === b.secondaryColor.toLowerCase()
  );
}

/** Appends an alpha channel to a 6-digit hex color, e.g. withAlpha('#F1C40F', '22') */
function withAlpha(hex: string, alphaHex: string) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  return `${hex}${alphaHex}`;
}

/* ------------------------------------------------------------------ */
/*  Live preview: a scaled-down replica of the WorkInSite dashboard,  */
/*  recolored with the candidate theme, so the swap is judged on the  */
/*  actual product screen rather than an abstract swatch.             */
/* ------------------------------------------------------------------ */
function LivePreview({ combo }: { combo: Theme }) {
  return (
    <div
      className="rounded-lg overflow-hidden border bg-white"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* App header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold"
            style={{ background: combo.secondaryColor, color: combo.primaryColor }}
          >
            W
          </span>
          <span className="text-sm font-bold" style={{ color: '#111' }}>
            WorkInSite
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#999' }}>
          <span>🔔</span>
          <span>☰</span>
        </div>
      </div>

      {/* Welcome strip */}
      <div className="px-4 py-2.5" style={{ background: combo.primaryColor }}>
        <span className="text-xs font-semibold" style={{ color: combo.secondaryColor }}>
          Welcome, Sabari 👋
        </span>
      </div>

      {/* Today at a glance */}
      <div className="grid grid-cols-2 gap-2 p-3">
        {glanceStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-md px-2.5 py-2"
            style={{ background: withAlpha(combo.primaryColor, '1f') }}
          >
            <p className="text-sm font-bold leading-tight" style={{ color: combo.secondaryColor }}>
              {stat.value}
            </p>
            <p className="text-[10px] leading-tight" style={{ color: '#555' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Sites list */}
      <div className="px-3 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold tracking-wide" style={{ color: '#999' }}>
            SITES
          </span>
          <span className="text-[10px] font-medium" style={{ color: combo.primaryColor }}>
            View all →
          </span>
        </div>
        <div className="rounded-md border divide-y" style={{ borderColor: 'var(--border)' }}>
          {previewSites.map((site) => (
            <div key={site.name} className="flex items-center justify-between px-2.5 py-1.5">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: combo.primaryColor }}
                />
                <span className="text-xs font-medium" style={{ color: '#222' }}>
                  {site.name}
                </span>
              </div>
              <span
                className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                style={{
                  background: withAlpha(combo.primaryColor, '22'),
                  color: combo.secondaryColor,
                }}
              >
                {site.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small swatch used in both the grid and the scrubber strip         */
/* ------------------------------------------------------------------ */
function Swatch({
  combo,
  active,
  isDefault,
  isUsing,
  size = 64,
  onClick,
}: {
  combo: Theme;
  active?: boolean;
  isDefault?: boolean;
  isUsing?: boolean;
  size?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: size,
        height: size,
        border: active ? '2px solid var(--foreground)' : '1px solid var(--border)',
      }}
      className="relative shrink-0 rounded-md overflow-hidden transition-transform hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <div style={{ height: '55%', background: combo.primaryColor }} />
      <div className="flex" style={{ height: '45%' }}>
        <div style={{ flex: 1, background: combo.secondaryColor }} />
        <div style={{ flex: 1, background: '#ffffff' }} />
      </div>

      {(isDefault || isUsing) && (
        <span
          className="absolute top-0.5 right-0.5 text-[8px] font-medium px-1 py-[1px] rounded-sm leading-tight"
          style={{
            background: isDefault ? '#fff' : '#000',
            color: isDefault ? '#000' : '#fff',
          }}
        >
          {isDefault ? 'Default' : 'Using'}
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
export const ThemeSelector = ({ onClose }: { onClose?: () => void }) => {
  const { theme, setTheme } = useTheme();
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);

  const selectedCombo = selectedIndex !== null ? colorCombinations[selectedIndex] : null;

  const scrollScrubberTo = useCallback((index: number) => {
    const el = scrubberRef.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, []);

  const openPreview = (index: number) => {
    setSelectedIndex(index);
    requestAnimationFrame(() => scrollScrubberTo(index));
  };

  const step = (delta: number) => {
    setSelectedIndex((prev) => {
      if (prev === null) return prev;
      const next = Math.min(Math.max(prev + delta, 0), colorCombinations.length - 1);
      requestAnimationFrame(() => scrollScrubberTo(next));
      return next;
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'Escape') setSelectedIndex(null);
  };

  const applyTheme = () => {
    if (!selectedCombo) return;
    setTheme(selectedCombo);
    onClose?.();
  };

  const isCurrentlyUsing = useMemo(
    () => (index: number) => sameTheme(theme, colorCombinations[index]),
    [theme],
  );

  /* ---------------------------- Preview mode ---------------------------- */
  if (selectedCombo && selectedIndex !== null) {
    return (
      <div className="px-1" onKeyDown={onKeyDown} tabIndex={-1}>
        <LivePreview combo={selectedCombo} />

        <div
          ref={scrubberRef}
          className="flex gap-3 overflow-x-auto py-4 px-0.5 scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {colorCombinations.map((combo, index) => (
            <Swatch
              key={index}
              combo={combo}
              size={48}
              active={index === selectedIndex}
              isDefault={index === 0}
              isUsing={isCurrentlyUsing(index)}
              onClick={() => openPreview(index)}
            />
          ))}
        </div>

        <Button
          variant="default"
          className="w-full"
          onClick={applyTheme}
          disabled={isCurrentlyUsing(selectedIndex)}
        >
          {isCurrentlyUsing(selectedIndex) ? t('Applied') : t('Apply Theme')}
        </Button>
      </div>
    );
  }

  /* ------------------------------ Grid mode ------------------------------ */
  return (
    <div className="px-1">
      <h3
        className="font-semibold mb-3"
        style={{ fontSize: isTamil ? '12px' : '14px', color: 'var(--gray-color)' }}
      >
        {t('Choose a Theme')}
      </h3>

      <div className="grid grid-cols-4 gap-3">
        {colorCombinations.map((combo, index) => (
          <div key={index} className="flex flex-col items-center gap-1.5">
            <Swatch
              combo={combo}
              size={64}
              isDefault={index === 0}
              isUsing={isCurrentlyUsing(index)}
              onClick={() => openPreview(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;