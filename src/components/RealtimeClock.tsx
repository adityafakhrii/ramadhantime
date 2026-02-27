import { useState, useEffect } from 'react';

interface RealtimeClockProps {
    timezone?: string; // e.g. "Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"
}

export function RealtimeClock({ timezone }: RealtimeClockProps) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Get time mapped to the specific timezone (or system default if not provided)
    const optionsDate: Intl.DateTimeFormatOptions = {
        timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };

    const optionsTime: Intl.DateTimeFormatOptions = {
        timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    };

    // Use Intl API to format string in Indonesian Locale
    const dateParts = new Intl.DateTimeFormat('id-ID', optionsDate).formatToParts(now);
    const timeParts = new Intl.DateTimeFormat('id-ID', optionsTime).formatToParts(now);

    const getPart = (parts: Intl.DateTimeFormatPart[], type: string) => parts.find(p => p.type === type)?.value || '';

    const dayName = getPart(dateParts, 'weekday');
    const dateStr = `${getPart(dateParts, 'day')} ${getPart(dateParts, 'month')} ${getPart(dateParts, 'year')}`;

    const timeStr = `${getPart(timeParts, 'hour')}:${getPart(timeParts, 'minute')}`;
    const secStr = getPart(timeParts, 'second');

    // Guess WIB/WITA/WIT based on the specific timezone offset
    // Since we don't have direct access to getTimezoneOffset() FOR a specific timezone string elegantly in vanilla JS,
    // we can use a small hack or known mapping for Indonesia:
    let tzName = "WIB";
    if (timezone) {
        if (timezone.includes("Jakarta") || timezone.includes("Bangkok") || timezone.includes("Ho_Chi_Minh") || timezone.includes("Phnom_Penh") || timezone.includes("Vientiane")) {
            tzName = "WIB";
        } else if (timezone.includes("Makassar") || timezone.includes("Bali") || timezone.includes("Singapore") || timezone.includes("Kuala_Lumpur") || timezone.includes("Brunei") || timezone.includes("Pontianak") || timezone.includes("Banjarmasin")) {
            tzName = "WITA";
        } else if (timezone.includes("Jayapura") || timezone.includes("Tokyo") || timezone.includes("Sorong") || timezone.includes("Ambon") || timezone.includes("Manokwari") || timezone.includes("Merauke") || timezone.includes("Timika")) {
            tzName = "WIT";
        } else {
            // Jika zona waktu di-load di luar mapping Asia / Indonesia di atas
            tzName = "Waktu Setempat";
        }
    } else {
        const offsetHours = -(now.getTimezoneOffset() / 60);
        if (offsetHours === 7) tzName = "WIB";
        else if (offsetHours === 8) tzName = "WITA";
        else if (offsetHours === 9) tzName = "WIT";
        else tzName = "Waktu Setempat";
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-background/50 rounded-2xl shadow-neu-sm mb-4">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
                {dayName}, {dateStr}
            </div>
            <div className="flex items-baseline font-mono-timer text-foreground">
                <span className="text-3xl font-bold tracking-tight">{timeStr}</span>
                <span className="text-sm font-medium text-muted-foreground ml-1">:{secStr} <span className="ml-1 text-primary">{tzName}</span></span>
            </div>
        </div>
    );
}
