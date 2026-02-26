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

  const size = 260;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Tick marks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const isMain = i % 5 === 0;
    const outerR = radius + 2;
    const innerR = radius - (isMain ? 10 : 5);
    return {
      x1: size / 2 + Math.cos(angle) * innerR,
      y1: size / 2 + Math.sin(angle) * innerR,
      x2: size / 2 + Math.cos(angle) * outerR,
      y2: size / 2 + Math.sin(angle) * outerR,
      isMain,
    };
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
        Countdown
      </p>

      <div 
        className="relative flex items-center justify-center my-2"
        style={{ width: size + 30, height: size + 30 }}
      >
        {/* Neumorphic circle bg */}
        <div
          className="absolute inset-0 rounded-full shadow-neu bg-background"
        />

        <svg width={size} height={size} className="relative z-10">
          {/* Tick marks */}
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={t.isMain ? 1.5 : 0.5}
              opacity={t.isMain ? 0.5 : 0.25}
            />
          ))}

          {/* Background track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius - 15}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={radius - 15}
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * (radius - 15)}
            strokeDashoffset={2 * Math.PI * (radius - 15) * (1 - progress)}
            className="transition-all duration-1000 ease-linear"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>

        {/* Center content */}
        <div className="absolute z-20 flex flex-col items-center">
          {/* Small icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" className="text-foreground/40 mb-2">
            <path
              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.7 0 3.3-.4 4.7-1.1C13.5 19.3 11 16 11 12s2.5-7.3 5.7-8.9C15.3 2.4 13.7 2 12 2z"
              fill="currentColor"
            />
          </svg>

          <div className="flex flex-col items-center font-mono-timer justify-center">
            <motion.span
              key={`h-${hours}-${minutes}`}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              className="text-4xl font-bold text-foreground tabular-nums leading-none tracking-tight"
            >
              {pad(hours)}:{pad(minutes)}
            </motion.span>
            <motion.span
              key={seconds}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className="text-lg font-medium text-muted-foreground tabular-nums mt-1"
            >
              :{pad(seconds)}
            </motion.span>
          </div>

          <p className="text-[11px] text-muted-foreground mt-2 text-center max-w-[120px] leading-tight">
            {label === 'Menuju Maghrib' ? 'Remaining for Iftar' : 'Remaining for Sahur'}
          </p>
        </div>
      </div>
    </div>
  );
}
