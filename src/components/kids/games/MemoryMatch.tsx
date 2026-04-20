import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, ArrowRight, Grid2X2 } from 'lucide-react';

const ICONS = ['☪️', '🕌', '🤲', '🕋', '📿', '📖'];

const generateDeck = () => {
    const pair = [...ICONS, ...ICONS];
    return pair.sort(() => Math.random() - 0.5).map((icon, id) => ({ id, icon }));
};

const MemoryMatch: FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [deck, setDeck] = useState(generateDeck());
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [disabled, setDisabled] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleFlip = (id: number) => {
        if (disabled || flipped.includes(id) || matched.includes(id)) return;

        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setDisabled(true);
            const [first, second] = newFlipped;

            if (deck[first].icon === deck[second].icon) {
                // Match
                setMatched([...matched, first, second]);
                setFlipped([]);
                setDisabled(false);
            } else {
                // No match
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    useEffect(() => {
        if (matched.length === deck.length && deck.length > 0) {
            setTimeout(() => setShowSuccess(true), 500);
        }
    }, [matched]);

    const resetGame = () => {
        setDeck(generateDeck());
        setMatched([]);
        setFlipped([]);
        setShowSuccess(false);
    };

    return (
        <div className="w-full h-full bg-purple-50 flex flex-col items-center pt-24 pb-10 px-6 relative overflow-hidden font-sans">
            <h2 className="text-3xl font-black text-purple-600 font-cursive tracking-wider absolute top-8 z-10 drop-shadow-sm">Memory Islami</h2>

            <AnimatePresence mode="wait">
                {!showSuccess ? (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex-1 w-full max-w-sm flex items-center justify-center relative mt-4"
                    >
                        <div className="grid grid-cols-3 gap-3 w-full">
                            {deck.map((card) => {
                                const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
                                return (
                                    <div
                                        key={card.id}
                                        className="aspect-[3/4] relative perspective-1000 cursor-pointer"
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
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center w-full z-10"
                    >
                        <PartyPopper className="w-20 h-20 text-purple-500 mb-6 drop-shadow-lg" />
                        <h3 className="text-4xl font-black text-purple-600 mb-2 font-cursive">Alhamdulillah!</h3>
                        <p className="text-purple-800 font-medium mb-8">Ingatanmu sangat kuat!</p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetGame}
                            className="bg-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 hover:bg-purple-600 transition"
                        >
                            Main Lagi <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default MemoryMatch;
