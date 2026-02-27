import { useHabits, type HabitType } from "@/hooks/useHabits";
import { Check, CheckCircle2, PartyPopper, Share2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { toBlob } from "html-to-image";
import { toast } from "sonner";

const HABIT_CONFIG: { id: HabitType; label: string; icon: string }[] = [
    { id: 'puasa', label: 'Puasa Wajib', icon: '🌙' },
    { id: 'tarawih', label: 'Sholat Tarawih', icon: '🕌' },
    { id: 'tilawah', label: 'Tilawah Q.R', icon: '📖' },
    { id: 'tahajud', label: 'Qiyamul Lail', icon: '✨' },
    { id: 'sedekah', label: 'Sedekah/Infaq', icon: '🤲' },
];

const getMotivationalQuote = (prog: number) => {
    if (prog === 0) return "Yuk mulai cicil ibadah pertamamu hari ini!";
    if (prog <= 40) return "Awal yang bagus, gas terus jangan kendor!";
    if (prog <= 80) return "Sedikit lagi nih, semangat ngejar target harian!";
    return "Masya Allah, ibadah lu hari ini murni 100%! Pertahankan besok ya.";
};

export const HabitTracker = () => {
    const { habits, toggleHabit, progress } = useHabits();
    const [showCongrats, setShowCongrats] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isSharing, setIsSharing] = useState(false);

    const shareHabit = async () => {
        if (!cardRef.current) return;
        try {
            setIsSharing(true);
            toast.loading("Menyiapkan gambar...", { id: "share-habit" });

            // Wait slightly for any animations to finish
            await new Promise(res => setTimeout(res, 100));

            const blob = await toBlob(cardRef.current, {
                backgroundColor: window.getComputedStyle(document.body).backgroundColor,
                style: { transform: 'scale(1)' }
            });

            if (!blob) throw new Error("Gagal rendering blob");

            const file = new File([blob], `Ramadhan-Habit-${new Date().getTime()}.png`, { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Habit Ramadhanku',
                    text: 'Alhamdulillah, progres ibadah Ramadhan saya hari ini! Ayo semangat juga kawan-kawan 🌙✨ #RamadhanTime',
                    files: [file]
                });
                toast.success("Berhasil dibuka di menu Share!", { id: "share-habit" });
            } else {
                // Fallback to download
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Gambar berhasil disimpan! (Browser tidak support Share API langsung)", { id: "share-habit" });
            }
        } catch (error: unknown) {
            console.error(error);
            const errName = typeof error === 'object' && error !== null && 'name' in error ? (error as Error).name : '';
            if (errName !== 'AbortError') {
                toast.error("Gagal membagikan gambar", { id: "share-habit" });
            }
        } finally {
            setIsSharing(false);
        }
    };

    useEffect(() => {
        if (progress === 100) {
            setShowCongrats(true);

            const end = Date.now() + 2 * 1000;
            const colors = ['#10b981', '#ffffff', '#34d399', '#fbbf24'];

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        } else {
            setShowCongrats(false);
        }
    }, [progress]);

    return (
        <div className="px-5 mb-5 mt-2">
            <div ref={cardRef} className="rounded-2xl shadow-neu p-5 bg-background border border-border/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-foreground font-bold">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <h3 className="text-lg">Habit Tracker</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {progress > 0 && (
                            <button
                                onClick={shareHabit}
                                disabled={isSharing}
                                className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                title="Pamer Kebaikan"
                            >
                                {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                            </button>
                        )}
                        <span className="text-sm font-semibold text-primary">{progress}%</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden mb-3">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-primary"
                    />
                </div>

                {/* Motivational Quote & Congrats Box */}
                <div className="mb-5">
                    <AnimatePresence mode="wait">
                        {progress < 100 ? (
                            <motion.p
                                key="quote"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-xs text-muted-foreground italic"
                            >
                                "{getMotivationalQuote(progress)}"
                            </motion.p>
                        ) : (
                            <motion.div
                                key="congrats"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center justify-center gap-2 text-primary font-medium text-sm text-center">
                                    <PartyPopper className="w-5 h-5 shrink-0" />
                                    <span>{getMotivationalQuote(progress)}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Habit List */}
                <div className="space-y-3">
                    {HABIT_CONFIG.map((item) => {
                        const isCompleted = habits[item.id];
                        return (
                            <button
                                key={item.id}
                                onClick={() => toggleHabit(item.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 border 
                  ${isCompleted
                                        ? 'bg-primary/5 border-primary/50 shadow-sm text-foreground'
                                        : 'bg-muted/10 border-transparent hover:bg-muted/20 text-muted-foreground'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{item.icon}</span>
                                    <span className={`font-medium text-sm ${isCompleted ? '' : 'opacity-80'}`}>
                                        {item.label}
                                    </span>
                                </div>

                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors
                  ${isCompleted
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-muted-foreground/30 bg-transparent'
                                    }`}
                                >
                                    {isCompleted && <Check className="w-4 h-4" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <p className="text-[10px] text-muted-foreground text-center mt-5">
                    Otomatis ter-reset pada jam 00:00 dini hari
                </p>
            </div>
        </div>
    );
};
