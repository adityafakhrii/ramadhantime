import { useState, useEffect, useMemo } from 'react';
import type { PrayerTimesData } from './usePrayerTimes';
import { getZonedTime, getZonedDate } from '@/lib/time';

interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
  label: string; // "Menuju Maghrib" or "Menuju Imsak"
  targetTime: string;
  progress: number; // 0-1 progress through the countdown period
  isZero: boolean;
}

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function useCountdown(prayerTimes: PrayerTimesData | null, timezone?: string): CountdownState | null {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const state = useMemo(() => {
    if (!prayerTimes) return null;

    const zonedNow = getZonedDate(now, timezone);
    const { h, m, s } = getZonedTime(now, timezone);
    const currentMin = h * 60 + m + s / 60;

    const maghribMin = timeToMinutes(prayerTimes.Maghrib);
    const imsakMin = timeToMinutes(prayerTimes.Imsak);
    const ishaMin = timeToMinutes(prayerTimes.Isha);
    const fajrMin = timeToMinutes(prayerTimes.Fajr);

    function timeToZonedDate(timeStr: string): Date {
      const [th, tm] = timeStr.split(':').map(Number);
      const d = new Date(zonedNow);
      d.setHours(th, tm, 0, 0);
      return d;
    }

    let targetDate: Date;
    let label: string;
    let periodStart: number;
    let periodEnd: number;

    if (currentMin < maghribMin && currentMin >= fajrMin) {
      // After Subuh, before Maghrib → countdown to Maghrib (Iftar)
      targetDate = timeToZonedDate(prayerTimes.Maghrib);
      label = "Menuju Buka Pe-we"; // Casual Iftar
      periodStart = fajrMin;
      periodEnd = maghribMin;
    } else {
      // After Maghrib or before Subuh → countdown to Subuh (End of Sahur)
      targetDate = timeToZonedDate(prayerTimes.Fajr);
      if (currentMin > fajrMin) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
      label = "Ngebut Sahur"; // Casual Subuh/Sahur limit
      periodStart = maghribMin;
      periodEnd = fajrMin + (fajrMin < maghribMin ? 24 * 60 : 0);
    }

    const diff = targetDate.getTime() - zonedNow.getTime();
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Calculate progress
    const totalPeriod = periodEnd - periodStart;
    let elapsed = currentMin - periodStart;
    if (elapsed < 0) elapsed += 24 * 60;
    const progress = totalPeriod > 0 ? Math.min(1, Math.max(0, elapsed / totalPeriod)) : 0;

    const isZero = hours === 0 && minutes === 0 && seconds === 0;

    return {
      hours,
      minutes,
      seconds,
      label,
      targetTime: label.includes('Buka') ? prayerTimes.Maghrib : prayerTimes.Fajr,
      progress,
      isZero
    };
  }, [prayerTimes, now, timezone]);

  useEffect(() => {
    // Only trigger once when countdown hits exactly 00:00:00
    if (state && state.hours === 0 && state.minutes === 0 && state.seconds === 0) {
      if ('Notification' in window && Notification.permission === 'granted') {
        const isMaghrib = state.label.includes('Buka');
        const notifKey = isMaghrib ? 'ramadhan-notif-iftar' : 'ramadhan-notif-sahur';
        // default enabled unless manually disabled
        if (localStorage.getItem(notifKey) !== 'false') {
          new Notification(isMaghrib ? 'Woy Buka Puasa Tiba!' : 'Udah Subuh Cuy!', {
            body: isMaghrib
              ? 'Gasskeun minum yang manis-manis. Jangan lupa doa bang.'
              : 'Waktu sahur fix udahan. Selamat menahan hawa nafsu seharian!',
            icon: '/favicon.ico',
            requireInteraction: true
          });
        }
      }
    }
  }, [state?.hours, state?.minutes, state?.seconds, state?.label, state]);

  return state;
}
