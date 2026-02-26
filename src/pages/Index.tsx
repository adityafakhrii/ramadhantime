import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useLocation } from '@/hooks/useLocation';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useCountdown } from '@/hooks/useCountdown';
import { CountdownTimer } from '@/components/CountdownTimer';
import { PrayerSchedule } from '@/components/PrayerSchedule';
import { CalendarView } from '@/components/CalendarView';
import { SettingsView } from '@/components/SettingsView';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { BottomNav, type TabType } from '@/components/BottomNav';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const { isDark, toggle: toggleTheme } = useTheme();
  const { location, loading: locLoading, detectLocation, setManualCity } = useLocation();
  const { todayTimes, monthlyTimes, loading: prayerLoading } = usePrayerTimes(location);
  const countdown = useCountdown(todayTimes);

  const isLoading = locLoading || prayerLoading;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-6 pb-2">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              🌙 Ramadhan Time
            </h1>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{location.city}</span>
            </div>
          </div>
          <p className="text-2xl">🏮</p>
        </header>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.main
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 space-y-6"
            >
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  {/* Countdown */}
                  <section className="pt-4">
                    {countdown && (
                      <CountdownTimer
                        hours={countdown.hours}
                        minutes={countdown.minutes}
                        seconds={countdown.seconds}
                        label={countdown.label}
                        targetTime={countdown.targetTime}
                        progress={countdown.progress}
                      />
                    )}
                  </section>

                  {/* Greeting */}
                  <p className="text-center text-sm text-muted-foreground italic">
                    ✨ Selamat Menjalankan Ibadah Puasa ✨
                  </p>

                  {/* Prayer Schedule */}
                  <section>
                    <h2 className="text-sm font-semibold text-foreground mb-3">
                      Jadwal Sholat Hari Ini
                    </h2>
                    {todayTimes && <PrayerSchedule times={todayTimes} />}
                  </section>
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
              transition={{ duration: 0.2 }}
            >
              <CalendarView monthlyTimes={monthlyTimes} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SettingsView
                isDark={isDark}
                onToggleTheme={toggleTheme}
                onSearchCity={setManualCity}
                onDetectLocation={detectLocation}
                locationLoading={locLoading}
                cityName={location.city}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default Index;
