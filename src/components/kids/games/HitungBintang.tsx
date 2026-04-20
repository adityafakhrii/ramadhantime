import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PartyPopper, Heart, ShieldAlert, PlayCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { useGameEngine } from './useGameEngine';

const generateStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        scale: Math.random() * 0.5 + 0.5,
        delay: Math.random() * 1
    }));
};

const HitungBintang: FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const engine = useGameEngine({ gameId: 'bintang', maxLives: 3, maxLevel: 5 });
    const [targetCount, setTargetCount] = useState(0);
    const [stars, setStars] = useState<any[]>([]);

    // Setup Level
    useEffect(() => {
        if (engine.status === 'PLAYING') {
            const count = Math.floor(Math.random() * 5) + (engine.level * 2); // Scales with level
            setTargetCount(count);
            setStars(generateStars(count));
        }
    }, [engine.level, engine.status]);

    const handleAnswer = (answer: number) => {
        if (answer === targetCount) {
            engine.addScore(100);
            engine.nextLevel();
        } else {
            engine.deductLife();
        }
    };

    // Generate 3 random options around the true answer
    const getOptions = () => {
        const set = new Set([targetCount]);
        while (set.size < 3) {
            let fake = targetCount + (Math.floor(Math.random() * 5) - 2);
            if (fake > 0 && fake !== targetCount) set.add(fake);
        }
        return Array.from(set).sort(() => Math.random() - 0.5);
    };

    return (
        <div className="w-full h-full bg-indigo-950 flex flex-col items-center pt-20 pb-10 px-6 relative overflow-hidden font-sans">
            <h2 className="text-3xl font-black text-indigo-200 font-cursive tracking-wider absolute top-8 z-10 drop-shadow-sm">Hitung Bintang</h2>

            <AnimatePresence mode="wait">
                {engine.status === 'MENU' && (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex-1 w-full max-w-sm flex flex-col items-center justify-center z-10"
                    >
                        <div className="w-32 h-32 bg-indigo-800 rounded-full flex items-center justify-center mb-8 border-4 border-indigo-400 shadow-xl relative">
                            <Sparkles className="w-16 h-16 text-yellow-400 absolute" />
                        </div>

                        <div className="space-y-4 w-full">
                            {engine.hasSave && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => engine.startGame(true)}
                                    className="w-full bg-amber-500 text-white px-8 py-4 rounded-full font-bold shadow-[0_6px_0_0_#d97706] active:translate-y-1 active:shadow-[0_2px_0_0_#d97706] transition-all flex items-center justify-center gap-2"
                                >
                                    <PlayCircle className="w-6 h-6" /> Lanjutkan (Level {JSON.parse(localStorage.getItem('kids_game_bintang') || '{}').level || 1})
                                </motion.button>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => engine.startGame(false)}
                                className="w-full bg-indigo-500 text-white px-8 py-4 rounded-full font-bold shadow-[0_6px_0_0_#4338ca] active:translate-y-1 active:shadow-[0_2px_0_0_#4338ca] transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-6 h-6" /> Mulai Baru
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {engine.status === 'PLAYING' && (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 w-full flex flex-col relative"
                    >
                        {/* HUD / Top Bar */}
                        <div className="w-full flex items-center justify-between bg-indigo-900/60 backdrop-blur px-4 py-3 rounded-2xl mb-6 shadow-sm border border-indigo-700 z-50">
                            <div className="flex bg-indigo-800/80 px-3 py-1 rounded-lg">
                                <span className="font-bold text-indigo-200">Level {engine.level}/{engine.maxLevel}</span>
                            </div>

                            <div className="flex gap-1">
                                {Array.from({ length: engine.maxLives }).map((_, i) => (
                                    <Heart key={i} className={`w-6 h-6 ${i < engine.lives ? 'text-rose-500 fill-rose-500' : 'text-slate-600 fill-slate-600'}`} />
                                ))}
                            </div>

                            <div className="flex bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/30">
                                <span className="font-bold text-amber-400 font-mono tracking-wider">{engine.score}</span>
                            </div>
                        </div>

                        {/* Stars Area */}
                        <div className="flex-1 relative w-full mb-6 rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-950 to-indigo-900 border border-indigo-800">
                            {stars.map((star) => (
                                <motion.div
                                    key={star.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: [0, star.scale * 1.5, star.scale],
                                        opacity: [0, 1, 0.8],
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: star.delay,
                                        repeat: Infinity,
                                        repeatType: 'reverse'
                                    }}
                                    className="absolute"
                                    style={{ left: `${star.x}%`, top: `${star.y}%` }}
                                >
                                    <Sparkles className="w-8 h-8 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]" fill="currentColor" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-3 gap-4 pb-4">
                            {getOptions().map((opt, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAnswer(opt)}
                                    className="bg-gradient-to-b from-indigo-500 to-indigo-600 border border-indigo-400 shadow-[0_4px_0_0_#312e81] rounded-2xl py-6 font-black text-3xl text-white active:translate-y-1 active:shadow-[0_0_0_0_#312e81] transition-all"
                                >
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {engine.status === 'GAME_OVER' && (
                    <motion.div
                        key="gameover"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center w-full z-10"
                    >
                        <ShieldAlert className="w-24 h-24 text-rose-500 mb-6 drop-shadow-lg" />
                        <h3 className="text-4xl font-black text-indigo-100 mb-2 font-cursive">Game Over!</h3>
                        <p className="text-indigo-300 font-medium mb-8 text-center text-lg px-4">Bintangnya dihitung baik-baik ya. Jangan menyerah!</p>

                        <div className="bg-indigo-900/50 p-4 rounded-2xl mb-8 w-full max-w-xs text-center border-2 border-indigo-700">
                            <span className="text-indigo-200 font-bold">Skor Akhir: {engine.score} pts</span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => engine.startGame(false)}
                            className="bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-2"
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
                        <h3 className="text-5xl font-black text-amber-400 mb-2 font-cursive drop-shadow-sm">Tamat!</h3>
                        <p className="text-indigo-200 font-bold text-xl mb-8">Wah, kamu jago berhitung!</p>

                        <div className="bg-indigo-900/80 p-6 rounded-3xl mb-8 w-full max-w-xs text-center border-4 border-indigo-500 shadow-xl">
                            <div className="text-indigo-300 text-sm font-bold uppercase mb-1">Skor Total</div>
                            <div className="text-5xl font-black text-amber-400 font-mono drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">{engine.score}</div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={engine.resetToMenu}
                            className="bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 hover:bg-indigo-600 transition"
                        >
                            Kembali ke Menu
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HitungBintang;
