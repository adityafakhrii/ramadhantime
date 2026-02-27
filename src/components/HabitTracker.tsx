import { useHabits, type HabitType } from "@/hooks/useHabits";
import { Check, CheckCircle2, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const HABIT_CONFIG: { id: HabitType; label: string; icon: string }[] = [
    { id: 'puasa', label: 'Puasa Wajib', icon: '🌙' },
    { id: 'tarawih', label: 'Sholat Tarawih', icon: '🕌' },
    { id: 'tilawah', label: 'Tilawah Q.R', icon: '📖' },
    { id: 'tahajud', label: 'Qiyamul Lail', icon: '✨' },
    { id: 'sedekah', label: 'Sedekah/Infaq', icon: '🤲' },
];

export const HabitTracker = () => {
    const { habits, toggleHabit, progress } = useHabits();
    const [showCongrats, setShowCongrats] = useState(false);

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
            <div className="rounded-2xl shadow-neu p-5 bg-background border border-border/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-foreground font-bold">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <h3 className="text-lg">Habit Tracker Ramadhan</h3>
                    </div>
                    <span className="text-sm font-semibold text-primary">{progress}%</span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden mb-5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-primary"
                    />
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
                                        ? 'bg-primary/5 border-primary shadow-sm text-foreground'
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

                <AnimatePresence>
                    {showCongrats && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center justify-center gap-2 text-primary font-medium text-sm text-center">
                                <PartyPopper className="w-5 h-5" />
                                <span>Masya Allah, ibadah lu hari ini murni 100%! Pertahankan besok ya.</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-[10px] text-muted-foreground text-center mt-4">
                    Otomatis ter-reset pada jam 00:00 dini hari
                </p>
            </div>
        </div>
    );
};
