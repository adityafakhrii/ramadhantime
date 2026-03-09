import { useCallback, useRef } from 'react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import type { PrayerTimesData } from '@/hooks/usePrayerTimes';

const PRAYER_LABELS: { key: keyof PrayerTimesData; label: string }[] = [
  { key: 'Imsak', label: 'Imsak' },
  { key: 'Fajr', label: 'Subuh' },
  { key: 'Dhuhr', label: 'Dzuhur' },
  { key: 'Asr', label: 'Ashar' },
  { key: 'Maghrib', label: 'Maghrib' },
  { key: 'Isha', label: 'Isya' },
];

interface ShareScheduleCardProps {
  times: PrayerTimesData;
  city: string;
}

export function ShareScheduleCard({ times, city }: ShareScheduleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      toast.loading('Membuat gambar...', { id: 'share' });

      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: '#0D1B2A',
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'jadwal-sholat.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'Jadwal Sholat Hari Ini',
          text: `Jadwal Sholat - ${city}`,
          files: [file],
        });
        toast.success('Berhasil dibagikan!', { id: 'share' });
      } else {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'jadwal-sholat.png';
        link.click();
        toast.success('Gambar berhasil diunduh!', { id: 'share' });
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        toast.error('Gagal membuat gambar', { id: 'share' });
      } else {
        toast.dismiss('share');
      }
    }
  }, [city]);

  return (
    <>
      {/* Hidden off-screen card for image generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div
          ref={cardRef}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #0D1B2A 100%)',
            padding: '32px 24px',
            width: '360px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.7 0 3.3-.4 4.7-1.1C13.5 19.3 11 16 11 12s2.5-7.3 5.7-8.9C15.3 2.4 13.7 2 12 2z" fill="#E0AA3E" />
              </svg>
              <span style={{ color: '#E0AA3E', fontSize: '18px', fontWeight: 800, letterSpacing: '1px' }}>
                RAMADHAN KAREEM
              </span>
            </div>
            <p style={{ color: '#8899AA', fontSize: '13px' }}>Jadwal Sholat Hari Ini</p>
            <p style={{ color: '#CCDDEE', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{city}</p>
            {times.hijri && (
              <p style={{ color: '#8899AA', fontSize: '11px', marginTop: '4px' }}>{times.hijri}</p>
            )}
          </div>
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #E0AA3E44, transparent)', marginBottom: '20px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PRAYER_LABELS.map((p) => (
              <div
                key={p.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  background: p.key === 'Maghrib' ? '#E0AA3E22' : '#ffffff08',
                }}
              >
                <span style={{ color: p.key === 'Maghrib' ? '#E0AA3E' : '#CCDDEE', fontSize: '14px', fontWeight: 600 }}>
                  {p.label}
                </span>
                <span style={{ color: p.key === 'Maghrib' ? '#E0AA3E' : '#FFFFFF', fontSize: '16px', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>
                  {times[p.key] as string}
                </span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: '#556677', fontSize: '10px' }}>ramadhantime.lovable.app</p>
          </div>
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="w-full py-2.5 rounded-xl bg-foreground/10 text-foreground font-semibold text-xs hover:bg-foreground/20 transition-colors flex items-center justify-center gap-2"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Bagikan
      </button>
    </>
  );
}
