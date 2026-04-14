import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import type { MonthlyPrayerData } from '@/hooks/usePrayerTimes';

interface CalendarViewProps {
  monthlyTimes: MonthlyPrayerData;
  isRamadhan?: boolean;
}

const PRAYER_ORDER = ['Imsak', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
const PRAYER_LABELS: Record<string, string> = {
  Imsak: 'Imsak', Fajr: 'Fajr', Dhuhr: 'Dhuhr',
  Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha',
};

export function CalendarView({ monthlyTimes, isRamadhan = false }: CalendarViewProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filter prayer columns based on mode
  const visiblePrayers = isRamadhan
    ? PRAYER_ORDER
    : PRAYER_ORDER.filter(k => k !== 'Imsak');

  const exportAsImage = async () => {
    if (!captureRef.current) return;
    try {
      setIsExporting(true);
      toast.loading("Menyiapkan gambar jadwal...", { id: "export-jadwal" });

      const originalPb = captureRef.current.style.paddingBottom;
      captureRef.current.style.paddingBottom = '32px';

      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: window.getComputedStyle(document.body).backgroundColor,
      });

      captureRef.current.style.paddingBottom = originalPb;

      const image = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = image;
      a.download = isRamadhan ? `Jadwal-Imsakiyah-Akyash.png` : `Jadwal-Sholat-Akyash.png`;
      a.click();

      toast.success("Gambar berhasil disimpan!", { id: "export-jadwal" });
    } catch (error) {
      console.error("Failed to export image", error);
      toast.error("Gagal menyimpan gambar", { id: "export-jadwal" });
    } finally {
      setIsExporting(false);
    }
  };

  let entries: [string, (typeof monthlyTimes)[string]][];

  if (isRamadhan) {
    // Ramadhan window filter: Feb 19 to Mar 20
    entries = Object.entries(monthlyTimes).filter(([date]) => {
      const [d, m] = date.split('-').map(Number);
      if (m === 2 && d >= 19) return true;
      if (m === 3 && d <= 20) return true;
      return false;
    });
  } else {
    // Show all entries for current month
    entries = Object.entries(monthlyTimes);
  }

  entries.sort(([a], [b]) => {
    const [da, ma, ya] = a.split('-').map(Number);
    const [db, mb, yb] = b.split('-').map(Number);
    return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
  });

  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Belom ada jadwal nih, set lokasi dulu ges.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between mb-4 mt-2">
          <h2 className="text-xl font-bold text-foreground">
            {isRamadhan ? 'Jadwal Imsakiyah' : 'Jadwal Sholat Bulanan'}
          </h2>
          <button
            onClick={exportAsImage}
            disabled={isExporting}
            className="p-2.5 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary/20 transition-colors"
            title="Download Jadwal sebulan full"
          >
            {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <div ref={captureRef} className="space-y-3 px-4 pb-28 bg-background">
        {entries.map(([date, times], i) => {
          const isToday = date === todayStr;
          const [day, month] = date.split('-');
          const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
          const dateObj = new Date(Number(date.split('-')[2]), Number(month) - 1, Number(day));
          const dayName = dayNames[dateObj.getDay()];

          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`rounded-2xl p-4 transition-all ${isToday ? 'shadow-neu bg-background' : 'bg-background/50'
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold font-mono-timer ${isToday ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {day}
                    </span>
                    <span className="text-xs text-muted-foreground">{dayName}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground/70 font-medium tracking-wide">
                    {times.hijri}
                  </span>
                </div>
                {isToday && (
                  <span className="text-[10px] bg-foreground text-background px-3 py-1 rounded-full font-semibold">
                    Hari Ini
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {visiblePrayers.map(key => (
                  <div key={key} className="text-center">
                    <p className="text-[10px] text-muted-foreground">{PRAYER_LABELS[key]}</p>
                    <p className="text-xs font-semibold font-mono-timer text-foreground">
                      {(times as unknown as Record<string, string>)[key]}
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
