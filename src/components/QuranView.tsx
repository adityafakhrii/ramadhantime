import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, ChevronLeft, Loader2, PlayCircle, Bookmark, Maximize2, Minimize2, Play, Pause } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Surah {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    tempatTurun: string;
    arti: string;
}

interface Ayat {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
    audio: {
        "01": string;
    };
}

interface SurahDetail extends Surah {
    ayat: Ayat[];
}

interface QuranViewProps {
    onFocusModeChange?: (isFocus: boolean) => void;
}

export const QuranView = ({ onFocusModeChange }: QuranViewProps) => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
    const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const [lastRead, setLastRead] = useState<{ surah: number; ayat: number; nama: string } | null>(null);

    // Focus & Auto-Scroll states
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isAutoScrolling, setIsAutoScrolling] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load last read
        const stored = localStorage.getItem('ramadhan-last-read');
        if (stored) {
            try {
                setLastRead(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse last read data from localStorage", e);
            }
        }

        // Fetch surah list
        fetch('https://equran.id/api/v2/surat')
            .then(res => res.json())
            .then(data => {
                setSurahs(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch surah list", err);
                setLoading(false);
            });
    }, []);

    const handleSelectSurah = (nomor: number) => {
        setSelectedSurah(nomor);
        setDetailLoading(true);
        setSurahDetail(null);
        fetch(`https://equran.id/api/v2/surat/${nomor}`)
            .then(res => res.json())
            .then(data => {
                setSurahDetail(data.data);
                setDetailLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch surah detail", err);
                setDetailLoading(false);
            });
    };

    const handleBack = () => {
        setSelectedSurah(null);
    };

    const saveLastRead = (surahNomor: number, ayatNomor: number, surahNama: string) => {
        const data = { surah: surahNomor, ayat: ayatNomor, nama: surahNama };
        setLastRead(data);
        localStorage.setItem('ramadhan-last-read', JSON.stringify(data));
    };

    const playAudio = (url: string) => {
        const audio = new Audio(url);
        audio.play().catch(e => console.error(e));
    };

    useEffect(() => {
        if (!isAutoScrolling || !contentRef.current) return;

        const interval = setInterval(() => {
            if (contentRef.current) {
                // Scroll down by 1 pixel every 50ms
                contentRef.current.scrollBy({ top: 1, left: 0, behavior: 'auto' });
            }
        }, 50);

        return () => clearInterval(interval);
    }, [isAutoScrolling]);

    // Derived classes for Focus Mode
    const containerClass = isFocusMode
        ? "fixed inset-0 z-50 bg-background flex flex-col pt-8 pb-4 px-4"
        : "pt-6 px-4 pb-24 h-[calc(100vh-5rem)]";

    return (
        <div className={containerClass}>
            <AnimatePresence mode="wait">
                {!selectedSurah ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                                <Book className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Al-Quran</h2>
                                <p className="text-sm text-muted-foreground">Baca Kapanpun di Manapun</p>
                            </div>
                        </div>

                        {lastRead && (
                            <div
                                onClick={() => handleSelectSurah(lastRead.surah)}
                                className="mb-5 rounded-2xl bg-primary text-primary-foreground p-4 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
                            >
                                <div>
                                    <p className="text-sm font-medium opacity-80 mb-1 flex items-center gap-2">
                                        <Bookmark className="w-4 h-4" /> Terakhir Dibaca
                                    </p>
                                    <p className="font-bold text-lg">QS. {lastRead.nama}</p>
                                    <p className="text-xs opacity-90">Ayat {lastRead.ayat}</p>
                                </div>
                                <ChevronLeft className="w-6 h-6 rotate-180" />
                            </div>
                        )}

                        <div className="flex-1 overflow-hidden rounded-2xl border border-border/50 bg-background/50">
                            <ScrollArea className="h-full">
                                {loading ? (
                                    <div className="flex justify-center items-center h-40">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/50">
                                        {surahs.map((surah) => (
                                            <button
                                                key={surah.nomor}
                                                onClick={() => handleSelectSurah(surah.nomor)}
                                                className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm select-none">
                                                        {surah.nomor}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-foreground">{surah.namaLatin}</h3>
                                                        <p className="text-xs text-muted-foreground">
                                                            {surah.arti} • {surah.jumlahAyat} Ayat
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-arabic text-foreground">{surah.nama}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="h-full flex flex-col"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            {!isFocusMode && (
                                <button
                                    onClick={handleBack}
                                    className="p-2 bg-background border border-border hover:bg-muted rounded-xl transition-colors shrink-0"
                                    title="Kembali ke Daftar Surat"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                            {surahDetail ? (
                                <div className="flex-1 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">QS. {surahDetail.namaLatin}</h2>
                                        <p className="text-xs text-muted-foreground">{surahDetail.arti} • {surahDetail.jumlahAyat} Ayat</p>
                                    </div>
                                    <button
                                        onClick={() => { const next = !isFocusMode; setIsFocusMode(next); onFocusModeChange?.(next); }}
                                        className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors shrink-0"
                                        title={isFocusMode ? "Keluar Mode Khusyuk" : "Mode Khusyuk (Layar Penuh)"}
                                    >
                                        {isFocusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                                    </button>
                                </div>
                            ) : (
                                <div className="h-4 w-32 bg-muted animate-pulse rounded flex-1" />
                            )}
                        </div>

                        {/* Surah Navigation */}
                        {surahDetail && (
                            <div className="flex items-center justify-between mb-4 gap-3">
                                {surahDetail.nomor > 1 ? (
                                    <button
                                        onClick={() => handleSelectSurah(surahDetail.nomor - 1)}
                                        className="flex-1 p-2 bg-background border border-border/50 hover:bg-muted rounded-xl text-xs font-semibold transition-colors flex flex-col items-center justify-center gap-0.5 text-muted-foreground"
                                    >
                                        <div className="flex items-center gap-1">
                                            <ChevronLeft className="w-4 h-4" />
                                            Sebelumnya
                                        </div>
                                        <span className="text-[10px] font-normal opacity-80">QS. {surahs.find(s => s.nomor === surahDetail.nomor - 1)?.namaLatin}</span>
                                    </button>
                                ) : <div className="flex-1" />}

                                {surahDetail.nomor < 114 ? (
                                    <button
                                        onClick={() => handleSelectSurah(surahDetail.nomor + 1)}
                                        className="flex-1 p-2 bg-background border border-border/50 hover:bg-muted rounded-xl text-xs font-semibold transition-colors flex flex-col items-center justify-center gap-0.5 text-muted-foreground"
                                    >
                                        <div className="flex items-center gap-1">
                                            Selanjutnya
                                            <ChevronLeft className="w-4 h-4 rotate-180" />
                                        </div>
                                        <span className="text-[10px] font-normal opacity-80">QS. {surahs.find(s => s.nomor === surahDetail.nomor + 1)?.namaLatin}</span>
                                    </button>
                                ) : <div className="flex-1" />}
                            </div>
                        )}

                        <div className="flex-1 overflow-hidden rounded-2xl bg-background border border-border/50 relative">
                            {detailLoading || !surahDetail ? (
                                <div className="flex justify-center items-center h-full">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                </div>
                            ) : (
                                <div ref={contentRef} className="h-full overflow-y-auto p-4 scroll-smooth">
                                    <div className="space-y-8 pb-32">
                                        {surahDetail.nomor !== 1 && surahDetail.nomor !== 9 && (
                                            <div className="text-center py-4 text-3xl font-arabic text-foreground">
                                                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                                            </div>
                                        )}
                                        {surahDetail.ayat.map((a) => (
                                            <div key={a.nomorAyat} className="space-y-4 pt-4 border-t border-border/50 first:border-0 first:pt-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex gap-2">
                                                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs select-none flex-shrink-0">
                                                            {a.nomorAyat}
                                                        </span>
                                                        <div className="flex flex-col gap-1">
                                                            <button
                                                                onClick={() => playAudio(a.audio["01"])}
                                                                className="p-1.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                                                                title="Putar Murottal"
                                                            >
                                                                <PlayCircle className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => saveLastRead(surahDetail.nomor, a.nomorAyat, surahDetail.namaLatin)}
                                                                className={`p-1.5 transition-colors ${lastRead?.surah === surahDetail.nomor && lastRead?.ayat === a.nomorAyat ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                                                                title="Tandai Terakhir Dibaca"
                                                            >
                                                                <Bookmark className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-3xl leading-loose font-arabic text-foreground text-right" dir="rtl">
                                                        {a.teksArab}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-primary italic leading-relaxed">{a.teksLatin}</p>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{a.teksIndonesia}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Auto-Scroll FAB */}
                                    {isFocusMode && (
                                        <div className="fixed bottom-6 right-6 z-50">
                                            <button
                                                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                                                className={`p-4 rounded-full shadow-neu text-white transition-all flex items-center gap-2 ${isAutoScrolling ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
                                            >
                                                {isAutoScrolling ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
