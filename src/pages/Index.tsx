import { useState, useCallback, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useLocation } from '@/hooks/useLocation';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useCountdown } from '@/hooks/useCountdown';
import { SplashScreen } from '@/components/SplashScreen';
import { CountdownTimer } from '@/components/CountdownTimer';
import { PrayerSchedule } from '@/components/PrayerSchedule';
import { CalendarView } from '@/components/CalendarView';
import { SettingsView } from '@/components/SettingsView';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { BottomNav, type TabType } from '@/components/BottomNav';
import { Switch } from '@/components/ui/switch';
import { RealtimeClock } from '@/components/RealtimeClock';
import { PWAPrompt } from '@/components/PWAPrompt';
import { useNotifications } from '@/hooks/useNotifications';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const { isDark, toggle: toggleTheme } = useTheme();
  const { location, loading: locLoading, detectLocation, setManualCity, setResolvedCity } = useLocation();
  const { todayTimes, monthlyTimes, loading: prayerLoading } = usePrayerTimes(location);
  const countdown = useCountdown(todayTimes);
  const { iftarNotif, sahurNotif, toggleIftar, toggleSahur } = useNotifications();

  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  const isLoading = locLoading || prayerLoading;

  // Minta izin notifikasi sekali saat aplikasi dimuat pertama kali
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          if (localStorage.getItem('ramadhan-notif-iftar') === null) {
            localStorage.setItem('ramadhan-notif-iftar', 'true');
          }
          if (localStorage.getItem('ramadhan-notif-sahur') === null) {
            localStorage.setItem('ramadhan-notif-sahur', 'true');
          }
        }
      });
    }
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <>
      <PWAPrompt />
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.main
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <header className="px-5 pt-8 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-4xl font-extrabold text-foreground leading-tight">
                        Ramadhan
                      </h1>
                      <h2 className="text-4xl font-extrabold text-foreground leading-tight">
                        Kareem
                      </h2>
                    </div>
                    {/* Lantern decoration */}
                    <svg width="50" height="70" viewBox="0 0 50 70" className="text-foreground/60 mt-1">
                      <line x1="25" y1="0" x2="25" y2="8" stroke="currentColor" strokeWidth="1" />
                      <path d="M20 5 Q25 0 30 5" fill="none" stroke="currentColor" strokeWidth="1" />
                      <line x1="25" y1="8" x2="25" y2="18" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M18 18h14v3H18z" fill="currentColor" opacity="0.7" />
                      <path d="M16 21c0 0 0 24 9 24s9-24 9-24" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M18 45h14v3H18z" fill="currentColor" opacity="0.7" />
                      {/* Crescent on top */}
                      <path d="M28 3C26 1 23 1 21 3c1-1 3 0 4 1s2 2 3 0z" fill="currentColor" opacity="0.5" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{location ? location.city : 'Lokasi Belum Diatur'}</span>
                  </div>
                </header>

                {isLoading ? (
                  <LoadingSkeleton />
                ) : !location ? (
                  <div className="px-5 mt-10">
                    <div className="rounded-2xl shadow-neu p-8 bg-background flex flex-col items-center justify-center text-center space-y-4">
                      <div className="p-4 bg-muted/50 rounded-full text-muted-foreground">
                        <MapPin className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Lokasi Belum Diatur</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Izinkan akses lokasi atau atur kota Anda secara manual untuk melihat jadwal Ramadhan.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('settings')}
                        className="mt-2 px-6 py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
                      >
                        Atur Lokasi
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 space-y-5">
                    <RealtimeClock />
                    {/* Alert Cards Row */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Iftar Alert Card */}
                      <div className="rounded-2xl shadow-neu p-4 bg-background">
                        <div className="flex items-center justify-between mb-3">
                          <svg width="16" height="16" viewBox="0 0 24 24" className="text-foreground">
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.7 0 3.3-.4 4.7-1.1C13.5 19.3 11 16 11 12s2.5-7.3 5.7-8.9C15.3 2.4 13.7 2 12 2z" fill="currentColor" />
                          </svg>
                          <Switch checked={iftarNotif} onCheckedChange={toggleIftar} />
                        </div>
                        <p className="text-3xl font-bold font-mono-timer text-foreground">
                          {todayTimes?.Maghrib || '--:--'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Iftar Alert</p>
                      </div>

                      {/* Prayer List Card */}
                      {todayTimes && <PrayerSchedule times={todayTimes} />}
                    </div>

                    {/* Sehar Alert Card */}
                    <div className="rounded-2xl shadow-neu p-4 bg-background flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" className="text-foreground">
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.7 0 3.3-.4 4.7-1.1C13.5 19.3 11 16 11 12s2.5-7.3 5.7-8.9C15.3 2.4 13.7 2 12 2z" fill="currentColor" />
                          </svg>
                          <Switch checked={sahurNotif} onCheckedChange={toggleSahur} />
                        </div>
                        <p className="text-3xl font-bold font-mono-timer text-foreground">
                          {todayTimes?.Imsak || '--:--'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Sehar Alert</p>
                      </div>
                      {/* Countdown preview */}
                      {countdown && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{countdown.label}</p>
                          <p className="text-lg font-bold font-mono-timer text-foreground">
                            {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Greeting */}
                    <p className="text-center text-xs text-muted-foreground italic pb-2">
                      Selamat Menjalankan Ibadah Puasa
                    </p>
                  </div>
                )}
              </motion.main>
            )}

            {activeTab === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-6"
              >
                {/* Countdown Section */}
                {!location ? (
                  <div className="px-5 mt-10">
                    <div className="rounded-2xl shadow-neu p-8 bg-background flex flex-col items-center justify-center text-center space-y-4">
                      <div className="p-4 bg-muted/50 rounded-full text-muted-foreground">
                        <MapPin className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Lokasi Belum Diatur</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Silakan atur lokasi Anda terlebih dahulu untuk melihat kalender jadwal puasa.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('settings')}
                        className="mt-2 px-6 py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
                      >
                        Atur Lokasi
                      </button>
                    </div>
                  </div>
                ) : countdown && !isLoading ? (
                  <div className="px-5 mb-6">
                    <CountdownTimer
                      hours={countdown.hours}
                      minutes={countdown.minutes}
                      seconds={countdown.seconds}
                      label={countdown.label}
                      targetTime={countdown.targetTime}
                      progress={countdown.progress}
                    />

                    {/* Info row */}
                    <div className="grid grid-cols-2 gap-3 mt-5">
                      <div className="rounded-2xl shadow-neu-sm p-3 bg-background flex items-center gap-3">
                        <svg width="14" height="14" viewBox="0 0 24 24" className="text-foreground/50">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.7 0 3.3-.4 4.7-1.1C13.5 19.3 11 16 11 12s2.5-7.3 5.7-8.9C15.3 2.4 13.7 2 12 2z" fill="currentColor" />
                        </svg>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {todayTimes?.Isha || '--:--'}
                          </p>
                          <p className="text-[10px] text-muted-foreground">Isha</p>
                        </div>
                      </div>
                      <div className="rounded-2xl shadow-neu-sm p-3 bg-background flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {countdown.label.includes('Maghrib') ? 'Iftar Alert' : 'Sahur Alert'}
                          </p>
                          <Switch
                            checked={countdown.label.includes('Maghrib') ? iftarNotif : sahurNotif}
                            onCheckedChange={countdown.label.includes('Maghrib') ? toggleIftar : toggleSahur}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                {location && <CalendarView monthlyTimes={monthlyTimes} />}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-6"
              >
                <SettingsView
                  isDark={isDark}
                  onToggleTheme={toggleTheme}
                  onSearchCity={setManualCity}
                  onSelectCity={setResolvedCity}
                  onDetectLocation={detectLocation}
                  locationLoading={locLoading}
                  cityName={location ? location.city : 'Belum diatur'}
                  iftarNotif={iftarNotif}
                  sahurNotif={sahurNotif}
                  onToggleIftar={toggleIftar}
                  onToggleSahur={toggleSahur}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>
    </>
  );
};

export default Index;
