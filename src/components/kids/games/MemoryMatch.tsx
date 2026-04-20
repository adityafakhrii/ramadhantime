import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, ArrowRight, Grid2X2, Heart, ShieldAlert, PlayCircle, RefreshCw } from 'lucide-react';
import { useGameEngine } from './useGameEngine';

const ICONS = ['☪️', '🕌', '🤲', '🕋', '📿', '📖'];

const generateDeck = (level: number) => {
    // We could increase difficulty by varying icons based on level, but 6 pairs (12 cards) is perfect for kids 3x4 grid
    const pair = [...ICONS, ...ICONS];
    return pair.sort(() => Math.random() - 0.5).map((icon, id) => ({ id, icon }));
};

const MemoryMatch: FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const engine = useGameEngine({ gameId: 'memory', maxLives: 4, maxLevel: 3 });
    const [deck, setDeck] = useState(generateDeck(1));
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [disabled, setDisabled] = useState(false);

    // Watch Level changes
    useEffect(() => {
        if (engine.status === 'PLAYING') {
            setDeck(generateDeck(engine.level));
            setMatched([]);
            setFlipped([]);
        }
    }, [engine.level, engine.status]);

    const handleFlip = (id: number) => {
        if (disabled || flipped.includes(id) || matched.includes(id) || engine.status !== 'PLAYING') return;

        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setDisabled(true);
            const [first, second] = newFlipped;

            if (deck[first].icon === deck[second].icon) {
                // Match
                setMatched([...matched, first, second]);
                setFlipped([]);
                engine.addScore(100);
                setDisabled(false);
            } else {
                // No match
                setTimeout(() => {
                    setFlipped([]);
                    engine.deductLife(); // Lose a life on wrong match!
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    // Check Win Level
    useEffect(() => {
        if (matched.length === deck.length && deck.length > 0) {
            setTimeout(() => {
                engine.nextLevel();
            }, 800);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matched]);

    const renderGameUI = () => (
        <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 w-full flex flex-col items-center justify-start mt-4"
        >
            {/* HUD / Top Bar */}
            <div className="w-full flex items-center justify-between bg-white/70 backdrop-blur px-4 py-3 rounded-2xl mb-6 shadow-sm border border-purple-100">
                <div className="flex bg-purple-100/50 px-3 py-1 rounded-lg">
                    <span className="font-bold text-purple-700">Level {engine.level}/{engine.maxLevel}</span>
                </div>

                <div className="flex gap-1">
                    {Array.from({ length: engine.maxLives }).map((_, i) => (
                        <Heart key={i} className={`w-6 h-6 ${i < engine.lives ? 'text-rose-500 fill-rose-500' : 'text-slate-300 fill-slate-300'}`} />
                    ))}
                </div>

                <div className="flex bg-amber-100/50 px-3 py-1 rounded-lg">
                    <span className="font-bold text-amber-600 font-mono tracking-wider">{engine.score} pts</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                {deck.map((card) => {
                    const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
                    return (
                        <div
                            key={card.id}
                            className="aspect-[3/4] relative cursor-pointer perspective-1000"
                            onClick={() => handleFlip(card.id)}
                        >
                            <motion.div
                                className="w-full h-full relative [transform-style:preserve-3d]"
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
                            >
                                {/* Front of card (Back side when faced down) */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-md border-b-4 border-purple-800 [backface-visibility:hidden] flex items-center justify-center">
                                    <Grid2X2 className="w-8 h-8 text-white/50" />
                                </div>

                                {/* Back of card (Icon revealed) */}
                                <div className="absolute inset-0 bg-white rounded-xl shadow-inner border-4 border-purple-200 [backface-visibility:hidden] flex items-center justify-center [transform:rotateY(180deg)]">
                                    <span className={`text-[40px] drop-shadow-sm ${matched.includes(card.id) ? 'scale-110 opacity-70 filter grayscale' : ''} transition-all`}>
                                        {card.icon}
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );

    return (
        <div className="w-full h-full bg-purple-50 flex flex-col items-center pt-24 pb-10 px-6 relative overflow-hidden font-sans">
            <h2 className="text-3xl font-black text-purple-600 font-cursive tracking-wider absolute top-8 z-10 drop-shadow-sm">Memory Islami</h2>

            <AnimatePresence mode="wait">
                {engine.status === 'MENU' && (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex-1 w-full max-w-sm flex flex-col items-center justify-center z-10"
                    >
                        <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-xl">
                            <Grid2X2 className="w-16 h-16 text-purple-500" />
                        </div>

                        <div className="space-y-4 w-full">
                            {engine.hasSave && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => engine.startGame(true)}
                                    className="w-full bg-amber-500 text-white px-8 py-4 rounded-full font-bold shadow-[0_6px_0_0_#d97706] active:translate-y-1 active:shadow-[0_2px_0_0_#d97706] transition-all flex items-center justify-center gap-2"
                                >
                                    <PlayCircle className="w-6 h-6" /> Lanjutkan (Level {JSON.parse(localStorage.getItem('kids_game_memory') || '{}').level || 1})
                                </motion.button>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => engine.startGame(false)}
                                className="w-full bg-purple-500 text-white px-8 py-4 rounded-full font-bold shadow-[0_6px_0_0_#7e22ce] active:translate-y-1 active:shadow-[0_2px_0_0_#7e22ce] transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-6 h-6" /> Mulai Baru
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {engine.status === 'PLAYING' && renderGameUI()}

                {engine.status === 'GAME_OVER' && (
                    <motion.div
                        key="gameover"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center w-full z-10"
                    >
                        <ShieldAlert className="w-24 h-24 text-rose-500 mb-6 drop-shadow-lg" />
                        <h3 className="text-4xl font-black text-slate-800 mb-2 font-cursive">Game Over!</h3>
                        <p className="text-slate-600 font-medium mb-8 text-center text-lg px-4">Kamu kehabisan hati karena salah menebak. Jangan menyerah!</p>

                        <div className="bg-white/50 p-4 rounded-2xl mb-8 w-full max-w-xs text-center border-2 border-rose-100">
                            <span className="text-rose-600 font-bold">Skor Akhir: {engine.score} pts</span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => engine.startGame(false)} // Restarts
                            className="bg-rose-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-2"
                        >
                            Coba Lagi <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}

                {engine.status === 'COMPLETED' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center w-full z-10"
                    >
                        <PartyPopper className="w-24 h-24 text-amber-500 mb-6 drop-shadow-lg" />
                        <h3 className="text-5xl font-black text-amber-500 mb-2 font-cursive drop-shadow-sm">Tamat!</h3>
                        <p className="text-amber-700 font-bold text-xl mb-8">Masya Allah, ingatanmu luar biasa!</p>

                        <div className="bg-white/80 p-6 rounded-3xl mb-8 w-full max-w-xs text-center border-4 border-amber-200 shadow-xl">
                            <div className="text-slate-500 text-sm font-bold uppercase mb-1">Skor Total</div>
                            <div className="text-4xl font-black text-amber-600 font-mono">{engine.score}</div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={engine.resetToMenu}
                            className="bg-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 hover:bg-purple-600 transition"
                        >
                            Kembali ke Menu
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default MemoryMatch;
