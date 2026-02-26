import { useState } from 'react';
import { Moon, Sun, Bell, MapPin, Search } from 'lucide-react';
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
}

export function SettingsView({
  isDark, onToggleTheme, onSearchCity, onDetectLocation, locationLoading, cityName,
}: SettingsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifEnabled, setNotifEnabled] = useState(() => localStorage.getItem('ramadhan-notif') === 'true');

  const handleNotifToggle = async (enabled: boolean) => {
    if (enabled && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return;
    }
    setNotifEnabled(enabled);
    localStorage.setItem('ramadhan-notif', String(enabled));
  };

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

      {/* Notifications */}
      <div className="rounded-2xl shadow-neu p-5 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-foreground" />
            <div>
              <p className="font-semibold text-sm text-foreground">Notifications</p>
              <p className="text-xs text-muted-foreground">10 min before Imsak & Maghrib</p>
            </div>
          </div>
          <Switch checked={notifEnabled} onCheckedChange={handleNotifToggle} />
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
          {locationLoading ? 'Detecting...' : 'Auto Detect'}
        </Button>

        <div className="flex gap-2">
          <Input
            placeholder="Search city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="text-sm rounded-xl"
          />
          <Button size="icon" onClick={handleSearch} disabled={locationLoading} className="rounded-xl">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
