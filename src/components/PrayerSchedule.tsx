import { motion } from 'framer-motion';
import type { PrayerTimesData } from '@/hooks/usePrayerTimes';

interface PrayerScheduleProps {
  times: PrayerTimesData;
}

const PRAYER_LABELS: { key: keyof PrayerTimesData; label: string }[] = [
  { key: 'Imsak', label: 'Imsak' },
  { key: 'Fajr', label: 'Fajr' },
  { key: 'Dhuhr', label: 'Dhuhr' },
  { key: 'Asr', label: 'Asr' },
  { key: 'Maghrib', label: 'Maghrib' },
  { key: 'Isha', label: 'Isha' },
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
    <div className="rounded-2xl shadow-neu p-5 bg-background">
      <div className="flex items-center gap-2 mb-4">
        <svg width="18" height="18" viewBox="0 0 24 24" className="text-foreground">
          <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z" fill="currentColor" opacity="0.6"/>
        </svg>
        <h3 className="text-sm font-bold text-foreground tracking-wide">Azan</h3>
      </div>
      <div className="space-y-1">
        {PRAYER_LABELS.map((prayer, i) => {
          const isNext = prayer.key === nextPrayer;
          return (
            <motion.div
              key={prayer.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`
                flex items-center justify-between py-2.5 px-3 rounded-xl transition-all
                ${isNext ? 'bg-foreground text-background' : ''}
              `}
            >
              <span className={`text-sm font-medium ${isNext ? 'text-background' : 'text-foreground'}`}>
                {prayer.label}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-mono-timer font-semibold ${isNext ? 'text-background' : 'text-foreground'}`}>
                  {times[prayer.key] as string}
                </span>
                {isNext && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 rounded-full bg-background flex items-center justify-center"
                  >
                    <div className="w-2 h-2 rounded-full bg-foreground" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
