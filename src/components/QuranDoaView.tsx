import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpenText } from 'lucide-react';
import { QuranView } from '@/components/QuranView';
import { DoaListView } from '@/components/DoaView';
import { TasbihCounter } from '@/components/TasbihCounter';
import { ScrollArea } from '@/components/ui/scroll-area';

type SubTab = 'quran' | 'doa' | 'tasbih';

interface QuranDoaViewProps {
  onFocusModeChange?: (isFocus: boolean) => void;
}

export const QuranDoaView = ({ onFocusModeChange }: QuranDoaViewProps) => {
  const [subTab, setSubTab] = useState<SubTab>('quran');

  const tabs: { id: SubTab; label: string }[] = [
    { id: 'quran', label: "Al-Qur'an" },
    { id: 'doa', label: 'Kumpulan Doa' },
    { id: 'tasbih', label: 'Tasbih Digital' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-6 flex flex-col h-[calc(100vh-4rem)]"
    >
      {/* Header */}
      <div className="px-4 flex items-center gap-3 mb-4 shrink-0">
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
          <BookOpenText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Al-Qur'an & Do'a</h2>
          <p className="text-sm text-muted-foreground">Baca, Berdoa & Berdzikir</p>
        </div>
      </div>

      {/* Sub-tab switcher */}
      <div className="px-4 flex gap-2 mb-4 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              subTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {subTab === 'quran' && (
          <QuranView onFocusModeChange={onFocusModeChange} embedded />
        )}
        {subTab === 'doa' && (
          <DoaListView />
        )}
        {subTab === 'tasbih' && (
          <ScrollArea className="h-full w-full">
            <div className="flex flex-col items-center pb-20 px-4">
              <div className="w-full max-w-sm">
                <TasbihCounter />
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
    </motion.div>
  );
};
