import { useState, useEffect, useCallback } from 'react';
import type { LocationData } from './useLocation';

export interface PrayerTimesData {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  date: string; // DD-MM-YYYY
  hijri: string; // Hijri DD Month YYYY
}

export interface MonthlyPrayerData {
  [date: string]: PrayerTimesData;
}

function getCacheKey(lat: number, lng: number, year: number) {
  return `ramadhan-prayer-${lat.toFixed(2)}-${lng.toFixed(2)}-${year}`;
}

export function usePrayerTimes(location: LocationData | null) {
  const [todayTimes, setTodayTimes] = useState<PrayerTimesData | null>(null);
  const [monthlyTimes, setMonthlyTimes] = useState<MonthlyPrayerData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthly = useCallback(async () => {
    if (!location) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const cacheKey = getCacheKey(location.latitude, location.longitude, year);

    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/calendar/${year}?latitude=${location.latitude}&longitude=${location.longitude}&method=20&tune=2,0,0,0,0,0,0,0,0`
      );

      if (!res.ok) throw new Error('API error');

      const json = await res.json();
      const data = json.data;

      const monthly: MonthlyPrayerData = {};
      const todayStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${year}`;

      Object.keys(data).forEach((monthKey) => {
        data[monthKey].forEach((day: any) => {
          const t = day.timings;
          const h = day.date.hijri;
          const dateStr = day.date.gregorian.date; // DD-MM-YYYY
          const entry: PrayerTimesData = {
            Imsak: t.Imsak.split(' ')[0],
            Fajr: t.Fajr.split(' ')[0],
            Sunrise: t.Sunrise.split(' ')[0],
            Dhuhr: t.Dhuhr.split(' ')[0],
            Asr: t.Asr.split(' ')[0],
            Maghrib: t.Maghrib.split(' ')[0],
            Isha: t.Isha.split(' ')[0],
            date: dateStr,
            hijri: `${h.day} ${h.month.en} ${h.year}`,
          };
          monthly[dateStr] = entry;

          if (dateStr === todayStr) {
            setTodayTimes(entry);
          }
        });
      });

      setMonthlyTimes(monthly);
      localStorage.setItem(cacheKey, JSON.stringify(monthly));
    } catch (err) {
      console.error('Prayer times fetch error:', err);
      setError('Gagal memuat jadwal. Menggunakan data offline.');

      // Try cache
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const monthly = JSON.parse(cached) as MonthlyPrayerData;
        setMonthlyTimes(monthly);
        const todayStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${year}`;
        if (monthly[todayStr]) {
          setTodayTimes(monthly[todayStr]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [location?.latitude, location?.longitude]);

  useEffect(() => {
    fetchMonthly();
  }, [fetchMonthly]);

  return { todayTimes, monthlyTimes, loading, error, refetch: fetchMonthly };
}
