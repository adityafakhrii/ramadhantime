import { motion } from 'framer-motion';

export const HABIT_RANKS = [
    { name: 'Muslim', minExp: 0, color: 'text-stone-500', bg: 'bg-stone-500', bgSoft: 'bg-stone-500/10', border: 'border-stone-500/30', icon: '🌱' },
    { name: 'Mukmin', minExp: 101, color: 'text-emerald-500', bg: 'bg-emerald-500', bgSoft: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: '🌿' },
    { name: 'Qanit', minExp: 301, color: 'text-sky-500', bg: 'bg-sky-500', bgSoft: 'bg-sky-500/10', border: 'border-sky-500/30', icon: '🌟' },
    { name: 'Shabir', minExp: 601, color: 'text-indigo-500', bg: 'bg-indigo-500', bgSoft: 'bg-indigo-500/10', border: 'border-indigo-500/30', icon: '🛡️' },
    { name: 'Mukhlis', minExp: 1001, color: 'text-violet-500', bg: 'bg-violet-500', bgSoft: 'bg-violet-500/10', border: 'border-violet-500/30', icon: '💎' },
    { name: 'Muhsin', minExp: 1501, color: 'text-amber-500', bg: 'bg-amber-500', bgSoft: 'bg-amber-500/10', border: 'border-amber-500/30', icon: '👑' },
    { name: 'Muttaqin', minExp: 2501, color: 'text-rose-500', bg: 'bg-rose-500', bgSoft: 'bg-rose-500/10', border: 'border-rose-500/30', icon: '✨' }
];

export function HabitRankDisplay({ exp }: { exp: number }) {
    const reversedIndex = [...HABIT_RANKS].reverse().findIndex(r => exp >= r.minExp);
    const currentRankIndex = reversedIndex >= 0 ? HABIT_RANKS.length - 1 - reversedIndex : 0;
    const currentRank = HABIT_RANKS[currentRankIndex];
    const nextRank = HABIT_RANKS[currentRankIndex + 1];

    let progressPercent = 100;
    let expNeeded = 0;

    if (nextRank) {
        const expInCurrentRank = exp - currentRank.minExp;
        const totalExpForNextRank = nextRank.minExp - currentRank.minExp;
        progressPercent = Math.min(100, Math.max(0, (expInCurrentRank / totalExpForNextRank) * 100));
        expNeeded = nextRank.minExp - exp;
    }

    return (
        <div className={`mb-5 p-4 rounded-2xl border-2 ${currentRank.border} ${currentRank.bgSoft} flex flex-col gap-3 relative overflow-hidden`}>
            {/* Background Glow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${currentRank.bg} opacity-20 blur-2xl pointer-events-none`}></div>

            <div className="flex items-center gap-4 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-white/50 border border-white/40 ring-4 ${currentRank.border}`}>
                    {currentRank.icon}
                </div>
                <div className="flex-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Rank Saat Ini</p>
                    <div className="flex items-center gap-2">
                        <h3 className={`text-xl font-black ${currentRank.color} drop-shadow-sm`}>{currentRank.name}</h3>
                    </div>
                    <p className="text-sm font-semibold text-foreground/80 mt-0.5">
                        {exp} <span className="text-xs text-muted-foreground font-normal">EXP</span>
                    </p>
                </div>
            </div>

            {nextRank ? (
                <div className="relative z-10">
                    <div className="flex justify-between items-end mb-1.5">
                        <span className="text-xs font-medium text-muted-foreground">Menuju <span className={`font-bold ${nextRank.color}`}>{nextRank.name}</span></span>
                        <span className="text-[10px] font-bold text-muted-foreground">{expNeeded} EXP lagi</span>
                    </div>
                    <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full ${currentRank.bg}`}
                        />
                    </div>
                </div>
            ) : (
                <div className="relative z-10 bg-black/5 rounded-xl p-2 text-center">
                    <p className="text-xs font-bold text-muted-foreground">🏅 Peringkat Maksimal Bulan Ini!</p>
                </div>
            )}
        </div>
    );
}
