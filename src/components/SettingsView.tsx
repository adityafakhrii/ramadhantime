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
  isDark,
  onToggleTheme,
  onSearchCity,
  onDetectLocation,
  locationLoading,
  cityName,
}: SettingsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifEnabled, setNotifEnabled] = useState(() => {
    return localStorage.getItem('ramadhan-notif') === 'true';
  });

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
    <div className="px-4 pb-24 pt-2 space-y-4 max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-foreground">⚙️ Pengaturan</h2>

      {/* Theme */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-accent" />}
            <div>
              <p className="font-semibold text-sm text-foreground">Mode Tampilan</p>
              <p className="text-xs text-muted-foreground">{isDark ? 'Mode Gelap' : 'Mode Terang'}</p>
            </div>
          </div>
          <Switch checked={isDark} onCheckedChange={onToggleTheme} />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-accent" />
            <div>
              <p className="font-semibold text-sm text-foreground">Notifikasi</p>
              <p className="text-xs text-muted-foreground">10 menit sebelum Imsak & Maghrib</p>
            </div>
          </div>
          <Switch checked={notifEnabled} onCheckedChange={handleNotifToggle} />
        </div>
      </div>

      {/* Location */}
      <div className="bg-card rounded-xl p-4 border border-border space-y-3">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-accent" />
          <div>
            <p className="font-semibold text-sm text-foreground">Lokasi</p>
            <p className="text-xs text-muted-foreground">Saat ini: {cityName}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onDetectLocation}
          disabled={locationLoading}
          className="w-full"
        >
          <MapPin className="w-4 h-4 mr-1" />
          {locationLoading ? 'Mendeteksi...' : 'Deteksi Otomatis'}
        </Button>

        <div className="flex gap-2">
          <Input
            placeholder="Cari kota..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="text-sm"
          />
          <Button size="icon" onClick={handleSearch} disabled={locationLoading}>
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Greeting */}
      <div className="text-center py-6">
        <p className="text-2xl">🌙</p>
        <p className="text-sm text-muted-foreground mt-2 italic">
          "Selamat Menjalankan Ibadah Puasa"
        </p>
      </div>
    </div>
  );
}
