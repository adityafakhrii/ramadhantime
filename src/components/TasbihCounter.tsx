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
  const [stats, setStats] = useState<Record<string, number>>(() => {
    const stored = localStorage.getItem('tasbih-stats');
    return stored ? JSON.parse(stored) : {};
  });

  const dzikir = DZIKIR_LIST[selectedIdx];
  const progress = Math.min(count / dzikir.target, 1);

  const handleNext = useCallback(() => {
    setCount(0);
    setSelectedIdx(prev => (prev + 1) % DZIKIR_LIST.length);
  }, []);

  const handleTap = useCallback(() => {
    const nextCount = count + 1;
    
    // Update total count
    setTotalCount(prev => {
      const next = prev + 1;
      localStorage.setItem('tasbih-total', String(next));
      return next;
    });

    // Check if target reached
    if (nextCount >= dzikir.target) {
      // Update stats for this dzikir
      setStats(prev => {
        const newStats = { ...prev, [dzikir.label]: (prev[dzikir.label] || 0) + 1 };
        localStorage.setItem('tasbih-stats', JSON.stringify(newStats));
        return newStats;
      });

      // Auto advance to next after a short delay
      setCount(dzikir.target); // Show the target reached
      setTimeout(() => {
        handleNext();
      }, 300);
    } else {
      setCount(nextCount);
    }

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);
  }, [count, dzikir, handleNext]);

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="space-y-8 w-full">
      {/* Dzikir selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full px-1 justify-start">
        {DZIKIR_LIST.map((d, i) => (
          <button
            key={d.label}
            onClick={() => { setSelectedIdx(i); setCount(0); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
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
      <div className="flex flex-col items-center justify-center py-4 text-center">
        <motion.p 
          key={dzikir.arab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-arabic text-foreground mb-3 leading-relaxed" 
          dir="rtl"
        >
          {dzikir.arab}
        </motion.p>
        <p className="text-base text-muted-foreground mb-8">{dzikir.label}</p>

        {/* Circular tap area */}
        <div className="relative flex items-center justify-center">
          <motion.button
            onClick={handleTap}
            whileTap={{ scale: 0.95 }}
            className="relative w-52 h-52 sm:w-56 sm:h-56 rounded-full shadow-neu flex items-center justify-center bg-background select-none active:shadow-neu-inset transition-shadow z-10"
          >
            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" opacity="0.1" />
              <circle
                cx="100" cy="100" r="90"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress)}`}
                className="transition-all duration-300 ease-out"
              />
            </svg>
            <div className="text-center z-10">
              <p className="text-5xl sm:text-6xl font-bold font-mono-timer text-foreground">{count}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">/ {dzikir.target}</p>
            </div>
          </motion.button>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Tap di mana saja pada lingkaran untuk menghitung
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted/30 text-muted-foreground hover:bg-muted/50 transition-colors text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Stats and Totals */}
      <div className="w-full space-y-4 pt-6 border-t border-border/50 px-1">
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-4">Statistik Harian</p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {DZIKIR_LIST.map((d) => (
              <div key={d.label} className="bg-muted/20 p-3 rounded-2xl flex flex-col items-center justify-center min-w-0">
                <span className="text-[9px] text-muted-foreground mb-1 truncate w-full text-center">{d.label}</span>
                <span className="text-sm font-bold text-foreground">
                  {(stats[d.label] || 0).toLocaleString()} 
                  <span className="text-[10px] font-normal opacity-70 ml-1">kali</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-primary/5 p-4 rounded-2xl flex justify-between items-center mt-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Total</span>
          <span className="text-lg font-bold text-primary">{totalCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
