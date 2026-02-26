import { useState, useEffect, useMemo } from 'react';
import type { PrayerTimesData } from './usePrayerTimes';

interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
  label: string; // "Menuju Maghrib" or "Menuju Imsak"
  targetTime: string;
  progress: number; // 0-1 progress through the countdown period
}

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function nowMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
}

function timeToDate(timeStr: string): Date {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export function useCountdown(prayerTimes: PrayerTimesData | null): CountdownState | null {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const state = useMemo(() => {
    if (!prayerTimes) return null;

    const currentMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const maghribMin = timeToMinutes(prayerTimes.Maghrib);
    const imsakMin = timeToMinutes(prayerTimes.Imsak);
    const ishaMin = timeToMinutes(prayerTimes.Isha);
    const fajrMin = timeToMinutes(prayerTimes.Fajr);

    let targetDate: Date;
    let label: string;
    let periodStart: number;
    let periodEnd: number;

    if (currentMin < maghribMin) {
      // Before Maghrib → countdown to Maghrib
      targetDate = timeToDate(prayerTimes.Maghrib);
      label = "Menuju Maghrib";
      periodStart = fajrMin;
      periodEnd = maghribMin;
    } else {
      // After Maghrib → countdown to tomorrow's Imsak
      targetDate = timeToDate(prayerTimes.Imsak);
      if (currentMin > imsakMin) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
      label = "Menuju Imsak";
      periodStart = ishaMin;
      periodEnd = imsakMin + (imsakMin < ishaMin ? 24 * 60 : 0);
    }

    const diff = targetDate.getTime() - now.getTime();
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Calculate progress
    const totalPeriod = periodEnd - periodStart;
    let elapsed = currentMin - periodStart;
    if (elapsed < 0) elapsed += 24 * 60;
    const progress = totalPeriod > 0 ? Math.min(1, Math.max(0, elapsed / totalPeriod)) : 0;

    return {
      hours,
      minutes,
      seconds,
      label,
      targetTime: label.includes('Maghrib') ? prayerTimes.Maghrib : prayerTimes.Imsak,
      progress,
    };
  }, [prayerTimes, now]);

  useEffect(() => {
    // Only trigger once when countdown hits exactly 00:00:00
    if (state && state.hours === 0 && state.minutes === 0 && state.seconds === 0) {
      if ('Notification' in window && Notification.permission === 'granted') {
        // default enabled unless manually disabled
        if (localStorage.getItem('ramadhan-notif') !== 'false') {
          const isMaghrib = state.label.includes('Maghrib');
          new Notification(`Waktu ${isMaghrib ? 'Berbuka Puasa' : 'Imsak'} Telah Tiba!`, {
            body: isMaghrib
              ? 'Selamat berbuka puasa. Jangan lupa membaca doa berbuka.'
              : 'Waktu Imsak telah tiba. Segera hentikan aktivitas sahur Anda.',
            icon: '/favicon.ico',
            requireInteraction: true
          });
        }
      }
    }
  }, [state?.hours, state?.minutes, state?.seconds, state?.label]);

  return state;
}
