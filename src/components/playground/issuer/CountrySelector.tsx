import { useState, useMemo, useRef, useEffect } from "react";
import { Search, MapPin, ChevronDown, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  priorityCountries,
  allCountries,
  getCountryByCode,
  type Country,
} from "@/data/countries";

interface CountrySelectorProps {
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  className?: string;
}

export function CountrySelector({
  value,
  onChange,
  placeholder = "Select a country...",
  className,
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = value ? getCountryByCode(value) : null;

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      // Show priority countries at top, then all others
      const priorityCodes = new Set(priorityCountries.map(c => c.code));
      const nonPriority = allCountries.filter(c => !priorityCodes.has(c.code));
      return { priority: priorityCountries, all: nonPriority };
    }

    const matchingPriority = priorityCountries.filter(c =>
      c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)
    );
    
    const priorityCodes = new Set(priorityCountries.map(c => c.code));
    const matchingAll = allCountries.filter(c =>
      !priorityCodes.has(c.code) &&
      (c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query))
    );

    return { priority: matchingPriority, all: matchingAll };
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (country: Country) => {
    onChange(country.code);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const totalResults = filteredCountries.priority.length + filteredCountries.all.length;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between h-9 px-3 font-normal"
      >
        <div className="flex items-center gap-2 truncate">
          {selectedCountry ? (
            <>
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{selectedCountry.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {selectedCountry && (
            <button
              onClick={handleClear}
              className="p-0.5 hover:bg-muted rounded"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
          <ChevronDown className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )} />
        </div>
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search countries..."
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>

          {/* Country List */}
          <ScrollArea className="max-h-[280px]">
            {totalResults === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No countries found
              </div>
            ) : (
              <div className="p-1">
                {/* Priority Countries Section */}
                {filteredCountries.priority.length > 0 && (
                  <div className="mb-1">
                    <p className="px-2 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Commonly Used
                    </p>
                    {filteredCountries.priority.map((country) => (
                      <CountryOption
                        key={country.code}
                        country={country}
                        isSelected={value === country.code}
                        onSelect={handleSelect}
                        isPriority
                      />
                    ))}
                  </div>
                )}

                {/* All Countries Section */}
                {filteredCountries.all.length > 0 && (
                  <div>
                    {filteredCountries.priority.length > 0 && (
                      <p className="px-2 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider border-t border-border mt-1 pt-2">
                        All Countries
                      </p>
                    )}
                    {filteredCountries.all.map((country) => (
                      <CountryOption
                        key={country.code}
                        country={country}
                        isSelected={value === country.code}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

interface CountryOptionProps {
  country: Country;
  isSelected: boolean;
  onSelect: (country: Country) => void;
  isPriority?: boolean;
}

function CountryOption({ country, isSelected, onSelect, isPriority }: CountryOptionProps) {
  return (
    <button
      onClick={() => onSelect(country)}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors text-left",
        isSelected
          ? "bg-primary/10 text-primary"
          : "hover:bg-muted text-foreground"
      )}
    >
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="truncate">{country.name}</span>
        {isPriority && !isSelected && (
          <span className="shrink-0 px-1.5 py-0.5 text-[9px] font-medium bg-primary/10 text-primary rounded">
            MOSIP
          </span>
        )}
      </div>
      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
    </button>
  );
}
