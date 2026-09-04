import { useState, useRef } from "react";
import { Input } from "@/shared/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/shared/components/lib/utils";

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  searchCategory?: string;
  placeholder?: string;
  allowAllCharacters?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  setSearchText,
  searchCategory,
  placeholder,
  allowAllCharacters = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (allowAllCharacters) {
      setSearchText(value.trimStart());
      return;
    }

    const sanitized = value
      .replace(/[^a-zA-Z\s]/g, "")
      .trimStart();
    setSearchText(sanitized);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 border rounded-md px-3 py-2.5 bg-background transition-colors cursor-text",
        focused ? "border-ring" : "border-border"
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Search Icon */}
      <Search
        className="shrink-0"
        style={{
          height: "16px",
          width: "16px",
          color: "var(--gray-color)",
        }}
      />

      {/* Input */}
     <Input
  ref={inputRef}
  value={searchText}
  onChange={handleChange}
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
  placeholder={placeholder ?? `${searchCategory ? ` ${searchCategory}` : ""}...`}
  style={{
    fontSize: "var(--font-sm)",
    color: "var(--foreground)",
    fontFamily: "Outfit, sans-serif",
  }}
  className="border-none shadow-none focus-visible:ring-0 p-0 pl-2 h-auto bg-transparent"
/>

      {/* Clear Button */}
      {searchText && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSearchText("");
            inputRef.current?.focus();
          }}
          style={{ color: "var(--gray-color)" }}
          className="hover:text-foreground transition-colors shrink-0"
        >
          <X style={{ height: "16px", width: "16px" }} />
        </button>
      )}
    </div>
  );
};

export { SearchBar };