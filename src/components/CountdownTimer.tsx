import { motion } from 'framer-motion';

interface CountdownTimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  label: string;
  targetTime: string;
  progress: number;
}

export function CountdownTimer({ hours, minutes, seconds, label, targetTime, progress }: CountdownTimerProps) {
  const pad = (n: number) => String(n).padStart(2, '0');

  // SVG circular progress
  const size = 280;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Label */}
      <motion.p
        key={label}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-semibold tracking-widest uppercase text-primary"
      >
        {label}
      </motion.p>

      {/* Circular countdown */}
      <div className="relative flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl animate-pulse-glow" />

        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={stroke}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Timer digits */}
        <div className="absolute flex flex-col items-center">
          <div className="flex items-baseline gap-1 font-mono-timer">
            <motion.span
              key={`h-${hours}`}
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl font-bold text-foreground tabular-nums"
            >
              {pad(hours)}
            </motion.span>
            <span className="text-3xl text-primary animate-pulse">:</span>
            <motion.span
              key={`m-${minutes}`}
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl font-bold text-foreground tabular-nums"
            >
              {pad(minutes)}
            </motion.span>
            <span className="text-3xl text-primary animate-pulse">:</span>
            <motion.span
              key={`s-${seconds}`}
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl font-bold text-foreground tabular-nums"
            >
              {pad(seconds)}
            </motion.span>
          </div>
          <div className="flex gap-8 mt-1 text-xs text-muted-foreground tracking-wider">
            <span>Jam</span>
            <span>Menit</span>
            <span>Detik</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Target: {targetTime}
          </p>
        </div>
      </div>
    </div>
  );
}
