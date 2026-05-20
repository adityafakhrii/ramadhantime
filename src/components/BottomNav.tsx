import { Home, CheckSquare, BookOpenText, Users, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export type TabType = 'home' | 'ibadah' | 'qurandoa' | 'forum' | 'store';

interface BottomNavProps {
  active: TabType;
  onChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'home' as TabType, label: 'Beranda', icon: Home },
  { id: 'ibadah' as TabType, label: 'Ibadah', icon: CheckSquare },
  { id: 'qurandoa' as TabType, label: "Qur'an & Do'a", icon: BookOpenText },
  { id: 'forum' as TabType, label: 'Forum', icon: Users },
  { id: 'store' as TabType, label: 'Store', icon: ShoppingBag },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav id="bottom-nav" className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+12px)] left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-primary rounded-full px-2 py-2 shadow-lg">
        {tabs.map(tab => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                relative flex items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-300
                ${isActive ? 'bg-background text-primary' : 'text-primary-foreground/70 hover:text-primary-foreground'}
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
