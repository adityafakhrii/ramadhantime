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
          {/* Akyash Pro Logo — stylized "a" with swooping curve */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
            className="relative mb-8"
          >
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              {/* Outer swooping arc — teal */}
              <motion.path
                d="M60 10C32 10 10 32 10 60s22 50 50 50c12 0 23-4 32-11"
                stroke="hsl(185, 30%, 52%)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
              {/* Inner stylized "a" — forest green */}
              <motion.path
                d="M60 35c-14 0-25 11-25 25s11 25 25 25c8 0 15-4 20-10V50c0-8-6-15-15-15"
                stroke="hsl(153, 32%, 42%)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: 'easeInOut', delay: 0.3 }}
              />
              {/* Accent dot — teal */}
              <motion.circle
                cx="85"
                cy="30"
                r="5"
                fill="hsl(185, 30%, 52%)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
              />
            </svg>
          </motion.div>

          {/* Decorative crescent moon + star (generic Islamic) */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute top-12 right-12"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" className="text-foreground/15">
              {/* Crescent moon */}
              <path
                d="M20 4C12 4 6 10 6 18s6 14 14 14c3 0 5.8-1 8-2.5C23.5 27.5 20 23 20 18s3.5-9.5 8-11.5C25.8 5 23 4 20 4z"
                fill="currentColor"
              />
              {/* Star */}
              <path
                d="M32 8l1.2 2.5L36 11l-2 2 .5 3-2.5-1.3L29.5 16l.5-3-2-2 2.8-.5z"
                fill="currentColor"
              />
            </svg>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-3xl font-extrabold text-foreground tracking-tight"
          >
            Akyash
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-3xl font-extrabold text-primary tracking-tight"
          >
            Pro
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="mt-3 text-sm text-muted-foreground"
          >
            Muslim Planner
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
