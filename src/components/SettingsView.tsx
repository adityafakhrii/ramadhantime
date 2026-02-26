import { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Bell, MapPin, Search, Download } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SettingsViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onSearchCity: (city: string) => void;
  onDetectLocation: () => void;
  locationLoading: boolean;
  cityName: string;
  iftarNotif: boolean;
  sahurNotif: boolean;
  onToggleIftar: (val: boolean) => void;
  onToggleSahur: (val: boolean) => void;
  onSelectCity: (loc: { latitude: number; longitude: number; city: string }) => void;
  isInstallable: boolean;
  onInstallApp: () => void;
}

export function SettingsView({
  isDark, onToggleTheme, onSearchCity, onDetectLocation, locationLoading, cityName,
  iftarNotif, sahurNotif, onToggleIftar, onToggleSahur, onSelectCity, isInstallable, onInstallApp
}: SettingsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search for autocomplete
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=id`
        );
        const data = await res.json();
        setSuggestions(data.results || []);
        setShowDropdown(true);
      } catch (err) {
        console.error('Failed to fetch city suggestions', err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearchCity(searchQuery.trim());
      setSearchQuery('');
    }
  };

  return (
    <div className="px-4 pb-28 pt-2 space-y-4 max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-foreground">Settings</h2>

      {/* Theme */}
      <div className="rounded-2xl shadow-neu p-5 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-5 h-5 text-foreground" /> : <Sun className="w-5 h-5 text-foreground" />}
            <div>
              <p className="font-semibold text-sm text-foreground">Appearance</p>
              <p className="text-xs text-muted-foreground">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
            </div>
          </div>
          <Switch checked={isDark} onCheckedChange={onToggleTheme} />
        </div>
      </div>

      {/* PWA Install Button */}
      {isInstallable && (
        <div className="rounded-2xl shadow-neu p-5 bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-foreground" />
              <div>
                <p className="font-semibold text-sm text-foreground">Pasang Aplikasi</p>
                <p className="text-xs text-muted-foreground">Download biar bisa offline</p>
              </div>
            </div>
            <Button size="sm" onClick={onInstallApp} className="rounded-xl h-8 px-4 text-xs">
              Install
            </Button>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="rounded-2xl shadow-neu p-5 bg-background space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-foreground" />
            <div>
              <p className="font-semibold text-sm text-foreground">Alarm Buka</p>
              <p className="text-xs text-muted-foreground">Notifikasi pas Maghrib</p>
            </div>
          </div>
          <Switch checked={iftarNotif} onCheckedChange={onToggleIftar} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-foreground" />
            <div>
              <p className="font-semibold text-sm text-foreground">Alarm Sahur</p>
              <p className="text-xs text-muted-foreground">Notifikasi pas Subuh/Imsak</p>
            </div>
          </div>
          <Switch checked={sahurNotif} onCheckedChange={onToggleSahur} />
        </div>
      </div>

      {/* Location */}
      <div className="rounded-2xl shadow-neu p-5 bg-background space-y-3">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-foreground" />
          <div>
            <p className="font-semibold text-sm text-foreground">Location</p>
            <p className="text-xs text-muted-foreground">Current: {cityName}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onDetectLocation}
          disabled={locationLoading}
          className="w-full rounded-xl"
        >
          <MapPin className="w-4 h-4 mr-1" />
          {locationLoading ? 'Bentar, lagi nyari...' : 'Lacak Otomatis'}
        </Button>

        <div className="relative" ref={dropdownRef}>
          <div className="flex gap-2">
            <Input
              placeholder="Cari nama kota..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch();
                  setShowDropdown(false);
                }
              }}
              className="text-sm rounded-xl"
            />
            <Button size="icon" onClick={() => { handleSearch(); setShowDropdown(false); }} disabled={locationLoading} className="rounded-xl shrink-0">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && (searchQuery.length >= 3) && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-background border border-border rounded-xl shadow-lg overflow-hidden">
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {isSearching ? (
                  <div className="p-3 text-sm text-muted-foreground text-center">Mencari...</div>
                ) : suggestions.length > 0 ? (
                  <div className="py-1">
                    {suggestions.map((s: any) => (
                      <button
                        key={s.id}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted text-foreground transition-colors flex flex-col"
                        onClick={() => {
                          onSelectCity({
                            latitude: s.latitude,
                            longitude: s.longitude,
                            city: s.name,
                          });
                          setSearchQuery('');
                          setShowDropdown(false);
                        }}
                      >
                        <span className="font-semibold">{s.name}</span>
                        {s.admin1 && s.country && (
                          <span className="text-xs text-muted-foreground">{s.admin1}, {s.country}</span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-sm text-muted-foreground text-center">Gak nemu kotanya ngab :(</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
