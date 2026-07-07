import { useRef, useState, useEffect } from "react";
import { FormInput } from "../FormInput/FormInput";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const PinField = (props: InputPropTypes) => {
  const { t } = useLanguage();
  const { label, errorMessage, className, isDisabled, required = false } = props;
  const { inputValue, handleInputChange } = useInputField(props);

  const [digits, setDigits] = useState<string[]>(() => {
    const chars = (inputValue || "").split("").slice(0, 4);
    return [...chars, ...Array(4 - chars.length).fill("")];
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    handleInputChange(digits.join(""));
  }, [digits]);

  const updateDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    const next = [...digits];
    pasted.split("").forEach((char, i) => { next[i] = char; });
    setDigits(next);
    const lastFilled = Math.min(pasted.length, 3);
    inputRefs.current[lastFilled]?.focus();
  };

  return (
    <FormInput errorMessage={errorMessage} className={className}>
      <Label className="mb-1 text-base font-medium text-black flex items-center gap-0.5">
        {label || t("Pin")}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex gap-6 w-full">
        {digits.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={isDisabled}
            onChange={(e) => updateDigit(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className="w-16 h-14 text-center text-lg font-semibold tracking-widest"
          />
        ))}
      </div>
    </FormInput>
  );
};

export { PinField };