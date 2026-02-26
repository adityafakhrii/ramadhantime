import { Home, CalendarDays, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export type TabType = 'home' | 'calendar' | 'settings';

interface BottomNavProps {
  active: TabType;
  onChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'home' as TabType, label: 'Home', icon: Home },
  { id: 'calendar' as TabType, label: 'Calendar', icon: CalendarDays },
  { id: 'settings' as TabType, label: 'Settings', icon: Settings },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-foreground rounded-full px-2 py-2 shadow-lg">
        {tabs.map(tab => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                relative flex items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-300
                ${isActive ? 'bg-background text-foreground' : 'text-background/70 hover:text-background'}
              `}
            >
              <tab.icon className="w-4 h-4" />
              {isActive && (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  className="text-xs font-semibold overflow-hidden whitespace-nowrap"
                >
                  {tab.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
