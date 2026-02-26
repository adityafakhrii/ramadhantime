import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { MonthlyPrayerData } from '@/hooks/usePrayerTimes';

interface CalendarViewProps {
  monthlyTimes: MonthlyPrayerData;
}

const PRAYER_ORDER = ['Imsak', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
const PRAYER_LABELS: Record<string, string> = {
  Imsak: 'Imsak',
  Fajr: 'Subuh',
  Dhuhr: 'Dzuhur',
  Asr: 'Ashar',
  Maghrib: 'Maghrib',
  Isha: 'Isya',
};

export function CalendarView({ monthlyTimes }: CalendarViewProps) {
  const entries = Object.entries(monthlyTimes).sort(([a], [b]) => {
    const [da, ma, ya] = a.split('-').map(Number);
    const [db, mb, yb] = b.split('-').map(Number);
    return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
  });

  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Tidak ada data kalender tersedia.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="space-y-3 px-4 pb-24 pt-2">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          📅 Jadwal Bulan Ini
        </h2>
        {entries.map(([date, times], i) => {
          const isToday = date === todayStr;
          const [day, month] = date.split('-');
          const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
          const dateObj = new Date(Number(date.split('-')[2]), Number(month) - 1, Number(day));
          const dayName = dayNames[dateObj.getDay()];

          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`
                rounded-xl p-4 border transition-all
                ${isToday
                  ? 'bg-primary/10 border-primary shadow-md'
                  : 'bg-card border-border'
                }
              `}
              id={isToday ? 'today-calendar' : undefined}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`
                    text-lg font-bold font-mono-timer
                    ${isToday ? 'text-primary' : 'text-foreground'}
                  `}>
                    {day}
                  </span>
                  <span className="text-xs text-muted-foreground">{dayName}</span>
                </div>
                {isToday && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-semibold">
                    Hari Ini
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PRAYER_ORDER.map(key => (
                  <div key={key} className="text-center">
                    <p className="text-[10px] text-muted-foreground">{PRAYER_LABELS[key]}</p>
                    <p className="text-xs font-semibold font-mono-timer text-foreground">
                      {(times as any)[key]}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
