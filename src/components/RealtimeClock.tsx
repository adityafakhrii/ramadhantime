import { useState, useEffect } from 'react';

export function RealtimeClock() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const dayName = days[now.getDay()];
    const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const secStr = pad(now.getSeconds());

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-background/50 rounded-2xl shadow-neu-sm mb-4">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
                {dayName}, {dateStr}
            </div>
            <div className="flex items-baseline font-mono-timer text-foreground">
                <span className="text-3xl font-bold tracking-tight">{timeStr}</span>
                <span className="text-sm font-medium text-muted-foreground ml-1">:{secStr}</span>
            </div>
        </div>
    );
}
