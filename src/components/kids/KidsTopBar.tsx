import { FC, useEffect, useState } from 'react';
import { KidsCharacter } from '@/pages/KidsMode';
import { KidsViewType } from './KidsDashboard';
import { ChevronLeft, CloudSun, Moon, Sun, Sunrise, Sunset } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';
import { usePrayerTimes, PrayerTimesData } from '@/hooks/usePrayerTimes';
import { getZonedTime } from '@/lib/time';

interface Props {
    character: KidsCharacter;
    activeView: KidsViewType;
    onBack: () => void;
}

const getNextTwoPrayers = (times: PrayerTimesData | null, timezone?: string) => {
    if (!times) return [
        { name: 'Dzuhur', time: '12:00' },
        { name: 'Ashar', time: '15:15' }
    ];

    const { h, m } = getZonedTime(new Date(), timezone);
    const currentMin = h * 60 + m;

    const schedule = [
        { name: 'Imsak', key: 'Imsak' },
        { name: 'Subuh', key: 'Fajr' },
        { name: 'Dzuhur', key: 'Dhuhr' },
        { name: 'Ashar', key: 'Asr' },
        { name: 'Maghrib', key: 'Maghrib' },
        { name: 'Isya', key: 'Isha' }
    ] as const;

    const futurePrayers = [];

    // Loop through today's prayers
    for (const prayer of schedule) {
        const timeStr = times[prayer.key as keyof PrayerTimesData];
        if (typeof timeStr === 'string') {
            const [ph, pm] = timeStr.split(':').map(Number);
            if (ph * 60 + pm > currentMin) {
                futurePrayers.push({ name: prayer.name, time: timeStr });
            }
        }
    }

    // If less than 2 future prayers left today, loop back to tomorrow's morning prayers
    if (futurePrayers.length < 2) {
        futurePrayers.push({ name: 'Imsak', time: times.Imsak as string });
        futurePrayers.push({ name: 'Subuh', time: times.Fajr as string });
    }

    return futurePrayers.slice(0, 2);
};

const getPrayerIcon = (name: string) => {
    switch (name.toLowerCase()) {
        case 'imsak':
        case 'subuh':
            return <Sunrise className="w-5 h-5 text-amber-500" />;
        case 'dzuhur':
            return <Sun className="w-5 h-5 text-amber-500 fill-amber-500" />;
        case 'ashar':
            return <CloudSun className="w-5 h-5 text-blue-500 fill-blue-500/20" />;
        case 'maghrib':
            return <Sunset className="w-5 h-5 text-orange-500" />;
        case 'isya':
            return <Moon className="w-5 h-5 text-indigo-500 fill-indigo-500" />;
        default:
            return <Sun className="w-5 h-5 text-amber-500" />;
    }
};

const KidsTopBar: FC<Props> = ({ character, activeView, onBack }) => {
    const isMili = character === 'mili';
    const name = isMili ? 'Mili' : 'Tan';

    const { location } = useLocation();
    const { todayTimes } = usePrayerTimes(location);
    const [nextPrayers, setNextPrayers] = useState<{ name: string, time: string }[]>([
        { name: 'Dzuhur', time: '12:00' },
        { name: 'Ashar', time: '15:15' }
    ]);

    useEffect(() => {
        setNextPrayers(getNextTwoPrayers(todayTimes, location?.timezone));

        // Refresh every minute to keep realtime valid
        const interval = setInterval(() => {
            setNextPrayers(getNextTwoPrayers(todayTimes, location?.timezone));
        }, 60000);
        return () => clearInterval(interval);
    }, [todayTimes, location]);

    return (
        <div className="w-full flex items-center justify-between px-2 py-4 pt-6 drop-shadow-md gap-1">
            {/* Character Profile / Back */}
            <div
                className="flex items-center gap-1.5 sm:gap-2 cursor-pointer bg-white/80 backdrop-blur-md pr-3 sm:pr-4 pl-1 py-1 rounded-full border border-white/50 shadow-sm"
                onClick={onBack}
            >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full border-2 border-white flex items-center justify-center shadow-inner overflow-hidden ${isMili ? 'bg-[#8eb28d]' : 'bg-[#4a7eb4]'}`}>
                    {/* Tiny placeholder for the character face icon */}
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#ecd2b3] rounded-full"></div>
                </div>
                <span className="font-bold text-slate-800 font-sans tracking-wide text-lg sm:text-xl truncate" style={{ fontFamily: 'cursive' }}>{name}</span>
            </div>

            {/* Info Widgets: Time, Weather */}
            <div className="flex gap-1.5 sm:gap-2 shrink-0">
                {nextPrayers.map((prayer, idx) => (
                    <div key={idx} className="flex items-center bg-white/95 backdrop-blur-md rounded-xl shadow-sm border-[1.5px] border-white overflow-hidden divide-x divide-slate-100 h-11 sm:h-12">
                        <div className="px-2 sm:px-3 flex flex-col justify-center items-center h-full bg-slate-50/50">
                            <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-none mb-0.5">{idx === 0 ? 'Selanjutnya' : 'Berikutnya'}</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-[10px] sm:text-xs font-bold text-slate-700">{prayer.name}</span>
                                <span className="text-xs sm:text-sm font-black text-slate-800">{prayer.time}</span>
                            </div>
                        </div>
                        <div className="px-1.5 sm:px-3 flex items-center justify-center bg-white">
                            {getPrayerIcon(prayer.name)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default KidsTopBar;
