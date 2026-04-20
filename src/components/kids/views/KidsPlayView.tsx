import { FC, useState } from 'react';
import { KidsCharacter } from '@/pages/KidsMode';
import { motion, AnimatePresence } from 'framer-motion';
import { SpellCheck, Star, Puzzle, Recycle, Quote, Blocks, ChevronLeft } from 'lucide-react';

import TebakHijaiyah from '../games/TebakHijaiyah';
import HitungBintang from '../games/HitungBintang';
import PuzzleMasjid from '../games/PuzzleMasjid';
import BersihBersih from '../games/BersihBersih';
import SusunKalimat from '../games/SusunKalimat';
import MemoryMatch from '../games/MemoryMatch';

interface Props {
    character: KidsCharacter;
}

const GAMES = [
    { id: 'hijaiyah', name: 'Tebak Hijaiyah', color: 'bg-rose-400', icon: SpellCheck, Component: TebakHijaiyah },
    { id: 'hitung', name: 'Hitung Bintang', color: 'bg-indigo-400', icon: Star, Component: HitungBintang },
    { id: 'puzzle', name: 'Puzzle Masjid', color: 'bg-teal-400', icon: Puzzle, Component: PuzzleMasjid },
    { id: 'bersih', name: 'Bersih Bersih', color: 'bg-green-500', icon: Recycle, Component: BersihBersih },
    { id: 'kalimat', name: 'Susun Kalimat', color: 'bg-amber-400', icon: Quote, Component: SusunKalimat },
    { id: 'memory', name: 'Memory Islami', color: 'bg-purple-400', icon: Blocks, Component: MemoryMatch },
];

const KidsPlayView: FC<Props> = ({ character }) => {
    const [activeGame, setActiveGame] = useState<string | null>(null);

    const ActiveComponent = activeGame ? GAMES.find(g => g.id === activeGame)?.Component : null;

    return (
        <div className="absolute inset-0 bg-[#f4f7fb] flex flex-col pt-24 pb-20 overflow-hidden">
            <AnimatePresence mode="wait">
                {!activeGame ? (
                    <motion.div
                        key="hub"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex-1 w-full px-4 overflow-y-auto"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        <h2 className="text-center font-black text-slate-800 text-2xl tracking-wider mb-6" style={{ fontFamily: 'cursive' }}>Ruang Game</h2>
                        <div className="grid grid-cols-2 gap-4 pb-12">
                            {GAMES.map((game) => {
                                const Icon = game.icon;
                                return (
                                    <motion.button
                                        key={game.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveGame(game.id)}
                                        className={`flex flex-col items-center justify-center p-6 rounded-3xl ${game.color} shadow-[0_6px_0_rgba(0,0,0,0.15)] transition-all relative overflow-hidden`}
                                    >
                                        <div className="absolute inset-0 bg-white/10 w-[200%] h-full transform origin-top-left -skew-x-[30deg] translate-x-12"></div>
                                        <Icon className="w-12 h-12 text-white mb-3 drop-shadow-md z-10" strokeWidth={2.5} />
                                        <span className="text-white font-black text-[13px] text-center uppercase tracking-wide leading-tight drop-shadow-md z-10">{game.name}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute inset-0 z-50 bg-white shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={() => setActiveGame(null)}
                            className="absolute top-6 left-4 z-[60] p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-md border hover:bg-white transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-slate-800" />
                        </button>
                        {ActiveComponent && <ActiveComponent onFinish={() => setActiveGame(null)} />}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default KidsPlayView;
