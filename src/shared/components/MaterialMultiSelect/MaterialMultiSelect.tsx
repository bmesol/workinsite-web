import { useState, useRef, useEffect, useId } from 'react';
import { ChevronsUpDown, Search, Check, X } from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/components/lib/utils';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

type MaterialOption = {
  label: string;
  value: string;
};

type SelectedMaterial = {
  id: number;
  name: string;
};

type Props = {
  materialDetails: MaterialOption[];
  selectedMaterials: SelectedMaterial[];
  onToggle: (id: number, name: string) => void;
  onSearch: (text: string) => void;
};

const SEARCH_DEBOUNCE_MS = 400;

const MaterialMultiSelect = ({
  materialDetails,
  selectedMaterials,
  onToggle,
  onSearch,
}: Props) => {
  const { t } = useLanguage();
  const listId = useId();
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasSelection = selectedMaterials.length > 0;
  const triggerLabel = hasSelection
    ? `${selectedMaterials.length} ${t('material(s) selected')}`
    : t('Select Materials');

  useEffect(() => {
    if (isOpen) onSearch('');
    else setSearchText('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = (text: string) => {
    setSearchText(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(text), SEARCH_DEBOUNCE_MS);
  };

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      {/* Label — matches SelectComboField labelNode */}
      <Label
        className="text-base font-medium flex items-center gap-0.5"
        style={{ color: 'var(--foreground)' }}
      >
        {t('Materials')}
      </Label>

      {/* Trigger — matches Button variant="outline" from SelectComboField */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-label={t('Materials')}
        className={cn(
          'w-full h-10 inline-flex items-center justify-between',
          'border border-input rounded-md bg-transparent',
          'px-4 py-2 font-normal text-sm',
          'transition-colors outline-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'hover:bg-accent hover:text-accent-foreground',
          'disabled:pointer-events-none disabled:opacity-50',
        )}
        style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'var(--font-sm)',
          color: hasSelection ? 'var(--foreground)' : 'var(--gray-color)',
        }}
      >
        <span className="flex-1 truncate text-left">{triggerLabel}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          id={listId}
          className="border border-border rounded-md bg-white dark:bg-background overflow-hidden shadow-md z-[200]"
        >
          {/* Search row */}
          <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              autoFocus
              value={searchText}
              onChange={e => handleChange(e.target.value)}
              placeholder={t('Search...')}
              aria-label={t('Search...')}
              className="flex-1 py-1 outline-none bg-transparent text-[var(--foreground)] placeholder:text-[var(--gray-color)]"
              style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'var(--font-sm)' }}
            />
          </div>

          {/* Options */}
          <div className="max-h-[150px] overflow-y-auto">
            {materialDetails.length > 0 ? (
              materialDetails.map(item => {
                const isSelected = selectedMaterials.some(
                  m => m.id === Number(item.value),
                );
                return (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => onToggle(Number(item.value), item.label)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-1.5 min-h-9',
                      'text-left transition-colors',
                      'text-[var(--gray-color)] hover:bg-[color-mix(in_srgb,var(--select-hover-bg)_50%,transparent)]',
                      isSelected && 'bg-[var(--select-hover-bg)] font-semibold text-[var(--secondary)] hover:bg-[var(--select-hover-bg)]',
                    )}
                    style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'var(--font-sm)' }}
                  >
                    <div
                      className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                      style={{
                        backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                        borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                      }}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="flex-1">{item.label}</span>
                  </button>
                );
              })
            ) : (
              <p className="p-3 text-center text-sm text-muted-foreground">
                {t('No items found.')}
              </p>
            )}
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 text-sm font-semibold border-t border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'var(--font-sm)' }}
          >
            {t('Close')}
          </button>
        </div>
      )}

      {/* Selected chips */}
      {hasSelection && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {selectedMaterials.map(m => (
            <button
              type="button"
              key={m.id}
              onClick={() => onToggle(m.id, m.name)}
              aria-label={`${t('Remove')} ${m.name}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[13px] font-medium whitespace-nowrap shrink-0 transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {m.name}
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { MaterialMultiSelect };
