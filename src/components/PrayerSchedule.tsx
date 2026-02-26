import { motion } from 'framer-motion';
import type { PrayerTimesData } from '@/hooks/usePrayerTimes';

interface PrayerScheduleProps {
  times: PrayerTimesData;
}

const PRAYER_LABELS: { key: keyof PrayerTimesData; label: string; icon: string }[] = [
  { key: 'Imsak', label: 'Imsak', icon: '🌙' },
  { key: 'Fajr', label: 'Subuh', icon: '🌅' },
  { key: 'Dhuhr', label: 'Dzuhur', icon: '☀️' },
  { key: 'Asr', label: 'Ashar', icon: '🌤️' },
  { key: 'Maghrib', label: 'Maghrib', icon: '🌇' },
  { key: 'Isha', label: 'Isya', icon: '🌃' },
];

function getNextPrayer(times: PrayerTimesData): string | null {
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();

  for (const p of PRAYER_LABELS) {
    const [h, m] = (times[p.key] as string).split(':').map(Number);
    if (h * 60 + m > currentMin) return p.key;
  }
  return null;
}

export function PrayerSchedule({ times }: PrayerScheduleProps) {
  const nextPrayer = getNextPrayer(times);

  return (
    <div className="grid grid-cols-3 gap-3">
      {PRAYER_LABELS.map((prayer, i) => {
        const isNext = prayer.key === nextPrayer;
        return (
          <motion.div
            key={prayer.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`
              relative rounded-xl p-3 text-center transition-all duration-300
              ${isNext
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-card text-card-foreground shadow-sm border border-border'
              }
            `}
          >
            <span className="text-lg">{prayer.icon}</span>
            <p className={`text-xs mt-1 font-medium ${isNext ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {prayer.label}
            </p>
            <p className={`text-base font-bold font-mono-timer mt-0.5 ${isNext ? 'text-primary-foreground' : 'text-foreground'}`}>
              {times[prayer.key] as string}
            </p>
            {isNext && (
              <motion.div
                layoutId="active-prayer"
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent"
                initial={false}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
