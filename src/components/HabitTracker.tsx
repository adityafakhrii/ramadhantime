import { useHabits, type CustomHabit } from "@/hooks/useHabits";
import { Check, CheckCircle2, PartyPopper, Share2, Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { toBlob } from "html-to-image";
import { toast } from "sonner";

const EMOJI_GRID = [
    '🕌', '📖', '🤲', '✨', '🌙', '💎', '🌟', '🕋',
    '📿', '🫶', '💚', '🤍', '🧕', '🎯', '💪', '🙏',
    '☪️', '🌅', '🌄', '🧘', '❤️', '📝', '⭐', '🔥',
];

const getMotivationalQuote = (prog: number) => {
    if (prog === 0) return "Yuk mulai cicil ibadah pertamamu hari ini!";
    if (prog <= 40) return "Awal yang bagus, gas terus jangan kendor!";
    if (prog <= 80) return "Sedikit lagi nih, semangat ngejar target harian!";
    return "Masya Allah, ibadah lu hari ini murni 100%! Pertahankan besok ya.";
};

interface HabitTrackerProps {
    isRamadhan?: boolean;
}

export const HabitTracker = ({ isRamadhan = false }: HabitTrackerProps) => {
    const { habits, completedMap, toggleHabit, addHabit, editHabit, deleteHabit, progress } = useHabits(isRamadhan);
    const [showCongrats, setShowCongrats] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isSharing, setIsSharing] = useState(false);

    // Add/Edit modal state
    const [showModal, setShowModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState<CustomHabit | null>(null);
    const [modalLabel, setModalLabel] = useState('');
    const [modalIcon, setModalIcon] = useState('🕌');

    const openAddModal = useCallback(() => {
        setEditingHabit(null);
        setModalLabel('');
        setModalIcon('🕌');
        setShowModal(true);
    }, []);

    const openEditModal = useCallback((habit: CustomHabit) => {
        setEditingHabit(habit);
        setModalLabel(habit.label);
        setModalIcon(habit.icon);
        setShowModal(true);
    }, []);

    const handleSaveHabit = useCallback(() => {
        const trimmed = modalLabel.trim();
        if (!trimmed) {
            toast.error("Nama ibadah gak boleh kosong!");
            return;
        }
        if (editingHabit) {
            editHabit(editingHabit.id, trimmed, modalIcon);
            toast.success("Ibadah berhasil diperbarui");
        } else {
            addHabit(trimmed, modalIcon);
            toast.success("Ibadah baru ditambahkan!");
        }
        setShowModal(false);
    }, [modalLabel, modalIcon, editingHabit, editHabit, addHabit]);

    const handleDeleteHabit = useCallback((habit: CustomHabit) => {
        deleteHabit(habit.id);
        toast.success(`"${habit.label}" dihapus`);
    }, [deleteHabit]);

    const shareHabit = async () => {
        if (!cardRef.current) return;
        try {
            setIsSharing(true);
            toast.loading("Menyiapkan gambar...", { id: "share-habit" });
            await new Promise(res => setTimeout(res, 100));

            const blob = await toBlob(cardRef.current, {
                backgroundColor: window.getComputedStyle(document.body).backgroundColor,
                style: { transform: 'scale(1)' }
            });

            if (!blob) throw new Error("Gagal rendering blob");
            const file = new File([blob], `Akyash-Habit-${new Date().getTime()}.png`, { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Habit Akyash',
                    text: 'Alhamdulillah, progres ibadah saya hari ini! Ayo semangat juga kawan-kawan ✨ #AkyashPro',
                    files: [file]
                });
                toast.success("Berhasil dibuka di menu Share!", { id: "share-habit" });
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Gambar berhasil disimpan!", { id: "share-habit" });
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

    const prevProgressRef = useRef(progress);

    useEffect(() => {
        const prev = prevProgressRef.current;
        prevProgressRef.current = progress;

        // Only fire confetti when progress transitions TO 100% (not when already at 100%)
        if (progress === 100 && prev < 100 && habits.length > 0) {
            setShowCongrats(true);

            const end = Date.now() + 2 * 1000;
            const colors = ['#6B9E7D', '#73AAAD', '#ffffff', '#fbbf24'];

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
        } else if (progress === 100) {
            setShowCongrats(true);
        } else {
            setShowCongrats(false);
        }
    }, [progress, habits.length]);

    return (
        <div className="px-5 mb-5 mt-2">
            <div ref={cardRef} className="rounded-2xl shadow-neu p-5 bg-background border border-border/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-foreground font-bold">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <h3 className="text-lg">Ibadah Harian</h3>
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
                <div className="space-y-2">
                    <AnimatePresence>
                        {habits.map((item) => {
                            const isCompleted = completedMap[item.id] || false;
                            const isRamadhanHabit = item.id === 'puasa' || item.id === 'tarawih';
                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex items-center gap-2 p-3 rounded-xl transition-all duration-200 border 
                                        ${isCompleted
                                            ? 'bg-primary/5 border-primary/50 shadow-sm'
                                            : 'bg-muted/10 border-transparent hover:bg-muted/20'
                                        }`}
                                >
                                    {/* Toggle button */}
                                    <button
                                        onClick={() => toggleHabit(item.id)}
                                        className="flex items-center gap-3 flex-1 min-w-0"
                                    >
                                        <span className="text-xl shrink-0">{item.icon}</span>
                                        <span className={`font-medium text-sm truncate ${isCompleted ? 'text-foreground' : 'text-muted-foreground opacity-80'}`}>
                                            {item.label}
                                        </span>
                                        {isRamadhanHabit && (
                                            <span className="text-[9px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                                                Ramadhan
                                            </span>
                                        )}
                                    </button>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-1 shrink-0">
                                        {!isRamadhanHabit && (
                                            <>
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-1 text-muted-foreground/50 hover:text-foreground transition-colors rounded"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteHabit(item)}
                                                    className="p-1 text-muted-foreground/50 hover:text-destructive transition-colors rounded"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        )}
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ml-1
                                            ${isCompleted
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-muted-foreground/30 bg-transparent'
                                            }`}
                                        >
                                            {isCompleted && <Check className="w-4 h-4" />}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Add Habit Button */}
                <button
                    onClick={openAddModal}
                    className="w-full mt-3 py-2.5 rounded-xl border-2 border-dashed border-primary/30 text-primary/70 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Ibadah
                </button>

                <p className="text-[10px] text-muted-foreground text-center mt-5">
                    Otomatis ter-reset pada jam 00:00 dini hari
                </p>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[80] bg-black/50 flex items-end sm:items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-background rounded-2xl shadow-xl w-full max-w-sm p-5 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-foreground text-base">
                                    {editingHabit ? 'Edit Ibadah' : 'Tambah Ibadah Baru'}
                                </h4>
                                <button onClick={() => setShowModal(false)} className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Icon Picker */}
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-2">Pilih Ikon</p>
                                <div className="grid grid-cols-8 gap-1.5">
                                    {EMOJI_GRID.map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => setModalIcon(emoji)}
                                            className={`text-xl p-1.5 rounded-lg transition-all ${modalIcon === emoji
                                                ? 'bg-primary/15 ring-2 ring-primary/50 scale-110'
                                                : 'hover:bg-muted/30'
                                                }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Label Input */}
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-2">Nama Ibadah</p>
                                <input
                                    type="text"
                                    value={modalLabel}
                                    onChange={e => setModalLabel(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') handleSaveHabit(); }}
                                    placeholder="Contoh: Sholat Dhuha"
                                    className="w-full px-4 py-2.5 bg-muted/20 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    autoFocus
                                />
                            </div>

                            {/* Preview */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 border border-border/50">
                                <span className="text-xl">{modalIcon}</span>
                                <span className="text-sm font-medium text-foreground">
                                    {modalLabel.trim() || 'Nama ibadah...'}
                                </span>
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleSaveHabit}
                                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                            >
                                {editingHabit ? 'Simpan Perubahan' : 'Tambahkan'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
