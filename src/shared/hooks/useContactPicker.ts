import { useCallback } from "react";

// TypeScript declarations for the Contact Picker API.
// These are not yet in all TypeScript lib.dom.d.ts versions.
interface ContactAddress {
  city?: string;
  country?: string;
  postalCode?: string;
  streetAddress?: string;
}

interface ContactInfo {
  name: string[];
  tel: string[];
  email: string[];
  address: ContactAddress[];
  icon: Blob[];
}

interface ContactsManager {
  select(
    properties: Array<keyof ContactInfo>,
    options?: { multiple?: boolean },
  ): Promise<ContactInfo[]>;
  getProperties(): Promise<Array<keyof ContactInfo>>;
}

declare global {
  interface Navigator {
    contacts?: ContactsManager;
  }
  interface Window {
    ContactsManager?: unknown;
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────────

/**
 * Strip all non-digit characters then take the last 10 digits.
 * Mirrors the mobile app's formatPhone utility.
 *
 * Examples:
 *   "+91 98765 43210"  → "9876543210"
 *   "98765 43210"      → "9876543210"
 *   "043-12345678"     → "4312345678"  (11 digits stripped to last 10)
 *   "12345"            → "12345"       (shorter than 10 — caller validates)
 */
const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
};

/**
 * Remove everything except English letters and spaces, collapse runs of
 * whitespace to a single space, trim edges, and cap at 75 characters
 * (matching NameField's maxLength).
 */
const sanitizeName = (raw: string): string =>
  raw
    .replace(/[^a-zA-Z ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 75);

// ─── types ───────────────────────────────────────────────────────────────────

export type ContactPickerResult = {
  name: string;
  phone: string;
};

export type PickContactFn = () => Promise<ContactPickerResult | null>;

export type UseContactPickerReturn = {
  isSupported: boolean;
  pickContact: PickContactFn;
};

// ─── hook ────────────────────────────────────────────────────────────────────

export const useContactPicker = (): UseContactPickerReturn => {
  const isSupported =
    typeof navigator !== "undefined" &&
    "contacts" in navigator &&
    "ContactsManager" in window;

  const pickContact = useCallback(async (): Promise<ContactPickerResult | null> => {
    if (!isSupported || !navigator.contacts) return null;

    const results = await navigator.contacts.select(["name", "tel"], {
      multiple: false,
    });

    // User closed the picker without selecting a contact
    if (!results || results.length === 0) return null;

    const contact = results[0];

    const rawName = contact.name?.find((n) => n.trim().length > 0) ?? "";
    const name = sanitizeName(rawName);

    const tels = contact.tel ?? [];

    if (tels.length === 0) {
      return { name, phone: "" };
    }

    // Single phone: use it directly.  Multiple phones: take the first one.
    const phone = formatPhone(tels[0]);

    return { name, phone };
  }, [isSupported]);

  return { isSupported, pickContact };
};
