import { useState } from 'react';

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

const MaterialMultiSelect = ({
  materialDetails,
  selectedMaterials,
  onToggle,
  onSearch,
}: Props) => {
  const [searchText, setSearchText] = useState('');

  const handleChange = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  return (
    <div className="mb-2">
      {/* Label */}
      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
        Materials
      </label>

      {/* Selected Chips */}
      {selectedMaterials.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedMaterials.map(m => (
            <button
              key={m.id}
              onClick={() => onToggle(m.id, m.name)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {m.name}
              <span className="text-xs">✕</span>
            </button>
          ))}
        </div>
      )}

      {/* Search Input */}
      <input
        type="text"
        value={searchText}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search materials..."
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white placeholder-gray-400 outline-none focus:ring-2 focus:border-transparent"
        style={{ '--tw-ring-color': 'var(--primary)' } as React.CSSProperties}
      />

      {/* Dropdown */}
      {materialDetails.length > 0 && (
        <div className="border border-gray-200 rounded-lg mt-1 bg-white max-h-[220px] overflow-y-auto">
          {materialDetails.map(item => {
            const isSelected = selectedMaterials.some(
              m => m.id === Number(item.value),
            );
            return (
              <button
                key={item.value}
                onClick={() => onToggle(Number(item.value), item.label)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 border-b border-gray-100 last:border-b-0 text-left transition-colors hover:bg-gray-50"
                style={{
                  backgroundColor: isSelected
                    ? 'color-mix(in srgb, var(--primary) 8%, transparent)'
                    : undefined,
                }}
              >
                {/* Checkbox */}
                <div
                  className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                    borderColor: isSelected ? 'var(--primary)' : '#D1D5DB',
                  }}
                >
                  {isSelected && (
                    <span className="text-white text-xs font-bold">✓</span>
                  )}
                </div>

                {/* Label */}
                <span
                  className="text-sm flex-1"
                  style={{
                    color: isSelected ? 'var(--primary)' : '#374151',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { MaterialMultiSelect };