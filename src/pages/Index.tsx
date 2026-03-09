import { useState, useCallback, useEffect, useRef } from 'react';
import { MapPin, Sunset, Moon, Compass, Calculator, Map } from 'lucide-react';
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
import { DoaView } from '@/components/DoaView';
import { QuranView } from '@/components/QuranView';
import { ZakatView } from '@/components/ZakatView';
import { QiblaView } from '@/components/QiblaView';
import { PWAPrompt } from '@/components/PWAPrompt';
import { DailyQuote } from '@/components/DailyQuote';
import { HabitTracker } from '@/components/HabitTracker';
import { useNotifications } from '@/hooks/useNotifications';
import { usePWA } from '@/hooks/usePWA';
import { toast } from 'sonner';
import type { PrayerTimesData } from '@/hooks/usePrayerTimes';
import { getZonedTime } from '@/lib/time';

// Helper function to find the next actual prayer visually
const getNextPrayer = (times: PrayerTimesData | null, timezone?: string) => {
  if (!times) return { name: 'Imsak', time: '--:--' };

  const { h, m } = getZonedTime(new Date(), timezone);
  const currentMin = h * 60 + m;

  const schedule = [
    { name: 'Imsak', key: 'Imsak' },
    { name: 'Subuh', key: 'Fajr' },
    { name: 'Dzuhur', key: 'Dhuhr' },
    { name: 'Ashar', key: 'Asr' },
    { name: 'Maghrib', key: 'Maghrib' },
    { name: 'Isya', key: 'Isha' }
  ] as const;

  for (const prayer of schedule) {
    const timeStr = times[prayer.key as keyof PrayerTimesData];
    if (typeof timeStr === 'string') {
      const [h, m] = timeStr.split(':').map(Number);
      if (h * 60 + m > currentMin) {
        return { name: prayer.name, time: timeStr };
      }
    }
  }
  return { name: 'Imsak', time: times.Imsak };
};

export type ExtendedTabType = TabType | 'qibla' | 'zakat';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<ExtendedTabType>('home');
  const { isDark, toggle: toggleTheme } = useTheme();
  const { location, loading: locLoading, detectLocation, setManualCity, setResolvedCity } = useLocation();
  const { todayTimes, monthlyTimes, loading: prayerLoading } = usePrayerTimes(location);
  const countdown = useCountdown(todayTimes, location?.timezone);
  const { iftarNotif, sahurNotif, toggleIftar, toggleSahur } = useNotifications();
  const { isInstallable, promptInstall } = usePWA();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);

  const stopAlarm = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAlarmRinging(false);
      toast.dismiss();
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audioRef.current.loop = true;
    }
  }, []);

  const isLoading = locLoading || prayerLoading;

  useEffect(() => {
    if (countdown?.isZero && !isLoading) {
      const isMaghrib = countdown.label.includes('Buka');
      const isSahur = !isMaghrib;

      if ((isMaghrib && iftarNotif) || (isSahur && sahurNotif)) {
        if (audioRef.current) {
          audioRef.current.play().then(() => {
            setIsAlarmRinging(true);
            toast("Waktunya tiba!", {
              description: isMaghrib ? "Saatnya berbuka puasa." : "Waktu sahur akan segera berakhir.",
              action: {
                label: "Matikan",
                onClick: () => stopAlarm()
              },
              duration: 60000
            });
          }).catch(e => {
            console.error("Audio autoplay blocked by browser", e);
            toast.error("Waktunya tiba! (Audio dibatasi browser, tekan di mana saja untuk izinkan)");
          });
        }
      }
    }
  }, [countdown?.isZero, countdown?.label, iftarNotif, sahurNotif, isLoading, stopAlarm]);

  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

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
      <PWAPrompt isInstallable={isInstallable} onInstall={promptInstall} />

      <AnimatePresence>
        {isAlarmRinging && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-4 right-4 z-[100] bg-primary text-primary-foreground p-4 rounded-2xl shadow-xl flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-lg">Alarm Berbunyi!</p>
              <p className="text-sm opacity-90">Tekan tombol untuk mematikan.</p>
            </div>
            <button
              onClick={stopAlarm}
              className="bg-background text-foreground px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm"
            >
              Matiin
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
                    <span>{location ? location.city : 'Blom ada lokasi nih'}</span>
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
                        <h3 className="text-xl font-bold text-foreground">Lokasi Kosong Bang</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Izinin app gue baca lokasi lu, atau set manual dah bair jadwalnya akurat.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('settings')}
                        className="mt-2 px-6 py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
                      >
                        Gass Atur Lokasi
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="px-5 space-y-5">
                      <RealtimeClock timezone={location.timezone} />
                      {/* Main Layout: Alert Column & Prayer List Column */}
                      <div className="grid grid-cols-2 gap-3">

                        {/* Alert Column */}
                        <div className="flex flex-col gap-3">
                          {/* Iftar Alert Card */}
                          <div className="rounded-2xl shadow-neu p-4 bg-background flex-1 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-3">
                              <Sunset className="w-5 h-5 text-foreground" />
                              <Switch checked={iftarNotif} onCheckedChange={toggleIftar} />
                            </div>
                            <div>
                              <p className="text-4xl font-bold font-mono-timer text-foreground">
                                {todayTimes?.Maghrib || '--:--'}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">Alarm Buka</p>
                            </div>
                          </div>

                          {/* Sehar Alert Card */}
                          <div className="rounded-2xl shadow-neu p-4 bg-background flex-1 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-3">
                              <Moon className="w-5 h-5 text-foreground" />
                              <Switch checked={sahurNotif} onCheckedChange={toggleSahur} />
                            </div>
                            <div>
                              <p className="text-4xl font-bold font-mono-timer text-foreground">
                                {todayTimes?.Imsak || '--:--'}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">Alarm Sahur</p>
                            </div>
                          </div>
                        </div>

                        {/* Prayer List Card Column */}
                        <div className="flex flex-col">
                          {todayTimes && <PrayerSchedule times={todayTimes} timezone={location?.timezone} />}
                        </div>
                      </div>

                      {/* Quick Actions / Fitur Lainnya */}
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setActiveTab('qibla')}
                          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-background shadow-neu-sm hover:opacity-80 transition-opacity"
                        >
                          <Compass className="w-6 h-6 text-primary mb-2" />
                          <span className="text-xs font-semibold text-foreground">Arah Kiblat</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('zakat')}
                          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-background shadow-neu-sm hover:opacity-80 transition-opacity"
                        >
                          <Calculator className="w-6 h-6 text-primary mb-2" />
                          <span className="text-xs font-semibold text-foreground">Zakat</span>
                        </button>
                        <button
                          onClick={() => window.open('https://www.google.com/maps/search/masjid+terdekat/', '_blank')}
                          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-background shadow-neu-sm hover:opacity-80 transition-opacity"
                        >
                          <Map className="w-6 h-6 text-primary mb-2" />
                          <span className="text-xs font-semibold text-foreground">Masjid</span>
                        </button>
                      </div>

                      {/* Greeting */}
                      <p className="text-center text-xs text-muted-foreground italic pb-2">
                        Stay Halal Brother & Sister! ✨
                      </p>
                    </div>
                    <HabitTracker />
                    <DailyQuote />
                  </>
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
                        <h3 className="text-xl font-bold text-foreground">Lokasi Kosong Bang</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Lu belum set lokasi, gimana gue mau ngasih liat hitung mundurnya bor.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('settings')}
                        className="mt-2 px-6 py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
                      >
                        Gass Atur Lokasi
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
                    {(() => {
                      const nextP = getNextPrayer(todayTimes, location?.timezone);
                      return (
                        <div className="grid grid-cols-2 gap-3 mt-5">
                          <div className="rounded-2xl shadow-neu-sm p-3 bg-background flex items-center gap-3">
                            <svg width="14" height="14" viewBox="0 0 24 24" className="text-foreground/50">
                              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.7 0 3.3-.4 4.7-1.1C13.5 19.3 11 16 11 12s2.5-7.3 5.7-8.9C15.3 2.4 13.7 2 12 2z" fill="currentColor" />
                            </svg>
                            <div>
                              <p className="text-sm font-bold text-foreground">
                                {nextP.time}
                              </p>
                              <p className="text-[10px] text-muted-foreground">Selanjutnya: {nextP.name}</p>
                            </div>
                          </div>
                          <div className="rounded-2xl shadow-neu-sm p-3 bg-background flex flex-col justify-center">
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                {countdown.label.includes('Buka') ? 'Alarm Buka' : 'Alarm Sahur'}
                              </p>
                              <Switch
                                checked={countdown.label.includes('Buka') ? iftarNotif : sahurNotif}
                                onCheckedChange={countdown.label.includes('Buka') ? toggleIftar : toggleSahur}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : null}
                {location && <CalendarView monthlyTimes={monthlyTimes} />}
              </motion.div>
            )}

            {activeTab === 'doa' && (
              <DoaView key="doa" />
            )}

            {activeTab === 'quran' && (
              <QuranView key="quran" onFocusModeChange={(focus) => {
                // Hide/show bottom nav based on focus mode
                const nav = document.getElementById('bottom-nav');
                if (nav) nav.style.display = focus ? 'none' : '';
              }} />
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
                  isInstallable={isInstallable}
                  onInstallApp={promptInstall}
                />
              </motion.div>
            )}

            {activeTab === 'qibla' && (
              <QiblaView key="qibla" onBack={() => setActiveTab('home')} />
            )}

            {activeTab === 'zakat' && (
              <ZakatView key="zakat" onBack={() => setActiveTab('home')} />
            )}
          </AnimatePresence>
        </div>

        <BottomNav active={activeTab as TabType} onChange={setActiveTab as (tab: TabType) => void} />
      </div>
    </>
  );
};

export default Index;
