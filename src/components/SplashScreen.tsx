import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 800);
    const t2 = setTimeout(() => setPhase('exit'), 2200);
    const t3 = setTimeout(onFinish, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Crescent Moon */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
            className="relative mb-8"
          >
            <svg width="120" height="120" viewBox="0 0 120 120" className="text-foreground">
              <motion.path
                d="M60 10C32.4 10 10 32.4 10 60s22.4 50 50 50c8.3 0 16.1-2 23-5.6C68.8 96.8 58 80 58 60s10.8-36.8 25-44.4C76.1 12 68.3 10 60 10z"
                fill="currentColor"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
              {/* Star */}
              <motion.circle
                cx="88"
                cy="28"
                r="3"
                fill="currentColor"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
              />
              <motion.circle
                cx="96"
                cy="40"
                r="2"
                fill="currentColor"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.3 }}
              />
            </svg>
          </motion.div>

          {/* Lantern */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute top-12 right-12"
          >
            <svg width="40" height="60" viewBox="0 0 40 60" className="text-foreground/30">
              <line x1="20" y1="0" x2="20" y2="15" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 15h16v3H12z" fill="currentColor" />
              <path d="M10 18c0 0 0 22 10 22s10-22 10-22" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 40h16v3H12z" fill="currentColor" />
            </svg>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-3xl font-extrabold text-foreground tracking-tight"
          >
            Ramadhan
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-3xl font-extrabold text-foreground tracking-tight"
          >
            Kareem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="mt-3 text-sm text-muted-foreground"
          >
            Jadwal Imsakiyah & Countdown
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
