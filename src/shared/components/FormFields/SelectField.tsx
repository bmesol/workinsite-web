import React, { useState } from 'react';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/shared/components/lib/utils';

interface SelectItem {
  label: string;
  value: string | number;
}

interface SelectFieldProps {
  label?: string;
  items: SelectItem[];
  selectedValue?: string | number;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  isDisabled?: boolean;
  required?: boolean;
  errorMessage?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  items,
  selectedValue,
  onValueChange,
  placeholder = 'Select',
  isDisabled = false,
  required = false,
  errorMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    if (isDisabled) return;
    setIsOpen(prev => !prev);
  };

  const handleSelect = (value: string | number) => {
    onValueChange(value);
    setIsOpen(false);
  };

  const selectedLabel = items.find(item => item.value === selectedValue)?.label;

  return (
    <div className="flex flex-col gap-1.5">

      {/* Label */}
      {label && (
        <Label className="text-base font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      {/* Trigger Button */}
      <Button
        type="button"
        variant="outline"
        role="combobox"
        disabled={isDisabled}
        onClick={toggleDropdown}
        className={cn(
          'w-full justify-between font-normal bg-white text-sm',
          !selectedLabel && 'text-muted-foreground',
          isDisabled && 'opacity-50 cursor-not-allowed',
          isOpen && 'border-primary',
        )}
      >
        {selectedLabel ?? placeholder}
        {isOpen
          ? <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          : <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        }
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="w-full rounded-md border border-border bg-white shadow-md z-50 max-h-[150px] overflow-y-auto animate-in fade-in-0 zoom-in-95"
          style={{ backgroundColor: 'var(--card)' }}
        >
          {items.map(item => (
            <div
              key={item.value}
              onClick={() => handleSelect(item.value)}
              className={cn(
                'flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-accent transition-colors',
                item.value === selectedValue && 'bg-accent font-medium',
              )}
            >
              <span>{item.label}</span>
              {item.value === selectedValue && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

    </div>
  );
};

export { SelectField };
export type { SelectFieldProps };