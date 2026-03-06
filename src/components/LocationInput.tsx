import { useState, useRef, useEffect } from "react";
import { MapPin, Navigation, X, Locate } from "lucide-react";
import type { Location } from "../lib/location";
import { searchLocations, findClosestLocation } from "../lib/location";

interface LocationInputProps {
  label: string;
  value: Location | null;
  onChange: (location: Location) => void;
  icon: "pickup" | "drop";
  showCurrentLocation?: boolean;
}

const LocationInput = ({ label, value, onChange, icon, showCurrentLocation }: LocationInputProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    setResults(searchLocations(val));
  };

  const handleSelect = (loc: Location) => {
    onChange(loc);
    setQuery("");
    setResults([]);
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    onChange(null as unknown as Location);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const closest = findClosestLocation(pos.coords.latitude, pos.coords.longitude);
        const currentLoc: Location = {
          id: "current",
          name: "Current Location",
          area: `Near ${closest.name}`,
          city: closest.city,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        onChange(currentLoc);
        setIsLocating(false);
        setIsFocused(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const displayValue = value ? `${value.name}, ${value.city}` : "";

  return (
    <div ref={wrapperRef} className="relative">
      <div
        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
          isFocused ? "bg-secondary/80 ring-1 ring-primary/40" : "bg-secondary/50"
        }`}
      >
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
            icon === "pickup" ? "bg-primary/20" : "bg-destructive/20"
          }`}
        >
          {icon === "pickup" ? (
            <MapPin className="h-4 w-4 text-primary" />
          ) : (
            <Navigation className="h-4 w-4 text-destructive" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-muted-foreground text-xs">{label}</div>
          {value && !isFocused ? (
            <div className="flex items-center gap-2">
              <span className="text-foreground font-medium text-sm truncate">{displayValue}</span>
              <button onClick={handleClear} className="shrink-0 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder={`Search ${label.toLowerCase()} location...`}
              className="w-full bg-transparent text-foreground text-sm font-medium outline-none placeholder:text-muted-foreground/60"
            />
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isFocused && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl bg-card border border-border shadow-xl overflow-hidden">
          {showCurrentLocation && (
            <button
              onClick={handleCurrentLocation}
              disabled={isLocating}
              className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors text-left border-b border-border"
            >
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Locate className={`h-4 w-4 text-primary ${isLocating ? "animate-spin" : ""}`} />
              </div>
              <div>
                <div className="text-sm font-medium text-primary">
                  {isLocating ? "Locating..." : "Use Current Location"}
                </div>
                <div className="text-xs text-muted-foreground">Via GPS</div>
              </div>
            </button>
          )}
          {results.length > 0
            ? results.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSelect(loc)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors text-left"
                >
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{loc.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {loc.area}, {loc.city}
                    </div>
                  </div>
                </button>
              ))
            : query.length >= 2 && (
                <div className="p-4 text-center text-sm text-muted-foreground">No locations found</div>
              )}
          {query.length < 2 && results.length === 0 && (
            <div className="p-3 text-xs text-muted-foreground text-center">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
