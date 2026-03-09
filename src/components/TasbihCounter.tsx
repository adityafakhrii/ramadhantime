import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const DZIKIR_LIST = [
  { label: 'Subhanallah', arab: 'سُبْحَانَ اللَّهِ', target: 33 },
  { label: 'Alhamdulillah', arab: 'الْحَمْدُ لِلَّهِ', target: 33 },
  { label: 'Allahu Akbar', arab: 'اللَّهُ أَكْبَرُ', target: 33 },
  { label: 'Istighfar', arab: 'أَسْتَغْفِرُ اللَّهَ', target: 100 },
  { label: 'La ilaha illallah', arab: 'لَا إِلٰهَ إِلَّا اللَّهُ', target: 100 },
];

export const TasbihCounter = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [totalCount, setTotalCount] = useState(() => {
    const stored = localStorage.getItem('tasbih-total');
    return stored ? parseInt(stored, 10) : 0;
  });

  const dzikir = DZIKIR_LIST[selectedIdx];
  const progress = Math.min(count / dzikir.target, 1);

  const handleTap = useCallback(() => {
    setCount(prev => prev + 1);
    setTotalCount(prev => {
      const next = prev + 1;
      localStorage.setItem('tasbih-total', String(next));
      return next;
    });
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);
  }, []);

  const handleReset = () => setCount(0);

  const handleNext = () => {
    setCount(0);
    setSelectedIdx(prev => (prev + 1) % DZIKIR_LIST.length);
  };

  return (
    <div className="space-y-6">
      {/* Dzikir selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {DZIKIR_LIST.map((d, i) => (
          <button
            key={d.label}
            onClick={() => { setSelectedIdx(i); setCount(0); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              i === selectedIdx
                ? 'bg-foreground text-background shadow-neu-sm'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Main counter area */}
      <div className="flex flex-col items-center">
        <p className="text-3xl font-arabic text-foreground mb-2" dir="rtl">{dzikir.arab}</p>
        <p className="text-sm text-muted-foreground mb-6">{dzikir.label}</p>

        {/* Circular tap area */}
        <motion.button
          onClick={handleTap}
          whileTap={{ scale: 0.95 }}
          className="relative w-48 h-48 rounded-full shadow-neu flex items-center justify-center bg-background select-none active:shadow-neu-inset transition-shadow"
        >
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" opacity="0.3" />
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress)}`}
              className="transition-all duration-200"
            />
          </svg>
          <div className="text-center z-10">
            <p className="text-5xl font-bold font-mono-timer text-foreground">{count}</p>
            <p className="text-xs text-muted-foreground mt-1">/ {dzikir.target}</p>
          </div>
        </motion.button>

        <p className="text-xs text-muted-foreground mt-4">Tap untuk menghitung</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 text-muted-foreground hover:bg-muted/50 transition-colors text-sm"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        {count >= dzikir.target && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={handleNext}
            className="px-4 py-2 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Dzikir Selanjutnya
          </motion.button>
        )}
      </div>

      {/* Total counter */}
      <div className="text-center pt-2 border-t border-border/50">
        <p className="text-xs text-muted-foreground">Total dzikir: <span className="font-bold text-foreground">{totalCount.toLocaleString()}</span></p>
      </div>
    </div>
  );
};
