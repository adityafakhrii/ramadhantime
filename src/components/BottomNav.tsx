import { Home, CalendarDays, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export type TabType = 'home' | 'calendar' | 'settings';

interface BottomNavProps {
  active: TabType;
  onChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'home' as TabType, label: 'Beranda', icon: Home },
  { id: 'calendar' as TabType, label: 'Kalender', icon: CalendarDays },
  { id: 'settings' as TabType, label: 'Pengaturan', icon: Settings },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2">
        {tabs.map(tab => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-col items-center gap-0.5 py-1 px-4 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-2 w-8 h-1 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon
                className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
