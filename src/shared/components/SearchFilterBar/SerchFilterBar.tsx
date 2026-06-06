import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/components/lib/utils';

interface SearchFilterBarProps {
  appliedFilters: string;
  placeholder?: string;
  onFilterOpen: () => void;
  onClearSearch: () => void;
}

const SearchFilterBar = ({
  appliedFilters,
  placeholder = 'Search...',
  onFilterOpen,
  onClearSearch,
}: SearchFilterBarProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex justify-end items-center gap-2 mt-4">
      {appliedFilters ? (
        <div
          className={cn(
            'flex items-center gap-2 border rounded-md px-3 py-2.5 bg-background transition-colors flex-1 md:flex-none md:w-auto',
            focused ? 'border-ring' : 'border-border',
          )}
        >
          <SlidersHorizontal
            className="shrink-0"
            style={{ height: '16px', width: '16px', color: 'var(--gray-color)' }}
          />
          <span
            className="truncate flex-1"
            style={{
              fontSize: 'var(--font-sm)',
              color: 'var(--foreground)',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {appliedFilters}
          </span>
          <button
            onClick={onClearSearch}
            style={{ color: 'var(--gray-color)' }}
            className="hover:text-foreground transition-colors shrink-0"
          >
            <X style={{ height: '16px', width: '16px' }} />
          </button>
        </div>
      ) : (
        <button
          onClick={onFilterOpen}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            'flex items-center gap-2 border rounded-md px-3 py-2.5 bg-background transition-colors flex-1 md:flex-none md:min-w-48',
            focused ? 'border-ring' : 'border-border',
          )}
        >
          <SlidersHorizontal
            className="shrink-0"
            style={{ height: '16px', width: '16px', color: 'var(--gray-color)' }}
          />
          <span
            style={{
              fontSize: 'var(--font-sm)',
              color: 'var(--gray-color)',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {placeholder}
          </span>
        </button>
      )}

      {appliedFilters && (
        <Button variant="outline" size="icon" onClick={onFilterOpen}>
          <SlidersHorizontal
            style={{ height: '16px', width: '16px', color: 'var(--gray-color)' }}
          />
        </Button>
      )}
    </div>
  );
};

export { SearchFilterBar };