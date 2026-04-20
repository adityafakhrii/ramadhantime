import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, ArrowRight } from 'lucide-react';

const SIZE = 3; // 3x3 grid

const shufflePuzzle = () => {
    let arr = Array.from({ length: SIZE * SIZE }, (_, i) => i);
    // Shuffle until it's not solved
    do {
        arr = arr.sort(() => Math.random() - 0.5);
    } while (arr.every((val, i) => val === i));
    return arr;
};

const PuzzleMasjid: FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [tiles, setTiles] = useState<number[]>([]);
    const [selectedTile, setSelectedTile] = useState<number | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setTiles(shufflePuzzle());
    }, []);

    const handleTileClick = (index: number) => {
        if (showSuccess) return;

        if (selectedTile === null) {
            setSelectedTile(index);
        } else {
            // Swap
            const newTiles = [...tiles];
            const temp = newTiles[selectedTile];
            newTiles[selectedTile] = newTiles[index];
            newTiles[index] = temp;

            setTiles(newTiles);
            setSelectedTile(null);

            // Check win condition
            if (newTiles.every((val, i) => val === i)) {
                setTimeout(() => setShowSuccess(true), 300);
            }
        }
    };

    const resetGame = () => {
        setTiles(shufflePuzzle());
        setShowSuccess(false);
    };

    return (
        <div className="w-full h-full bg-teal-50 flex flex-col items-center justify-center relative overflow-hidden font-sans">
            <h2 className="text-3xl font-black text-teal-600 font-cursive tracking-wider absolute top-8 drop-shadow-sm">Puzzle Masjid</h2>
            <p className="text-teal-600 font-medium absolute top-20">Tap dua kotak untuk menukar posisinya</p>

            <AnimatePresence mode="wait">
                {!showSuccess ? (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="mt-10"
                    >
                        <div
                            className="grid bg-slate-300 gap-1 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-700 p-1"
                            style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
                        >
                            {tiles.map((tileValue, i) => {
                                // tileValue defines the piece of the image it holds
                                const originalX = (tileValue % SIZE) * 100;
                                const originalY = Math.floor(tileValue / SIZE) * 100;

                                const isSelected = selectedTile === i;
                                const isCorrect = tileValue === i;

                                return (
                                    <motion.button
                                        key={i}
                                        layout
                                        whileHover={{ scale: 0.95 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleTileClick(i)}
                                        className={`w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] shadow-sm relative overflow-hidden transition-all duration-200 ${isSelected ? 'ring-4 ring-rose-500 z-10 scale-95' : ''} ${isCorrect && !isSelected ? 'brightness-110' : ''}`}
                                    >
                                        <div
                                            className="w-full h-full bg-cover"
                                            style={{
                                                backgroundImage: `url(/kids/puzzle_masjid.png)`,
                                                backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`,
                                                backgroundPosition: `${-(originalX)}% ${-(originalY)}%`
                                            }}
                                        />
                                        {/* Overlay to subtly show it's correctly placed */}
                                        {isCorrect && (
                                            <div className="absolute inset-0 bg-green-400/20 mix-blend-multiply pointer-events-none border border-green-500/50"></div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center w-full z-10 mt-10"
                    >
                        <PartyPopper className="w-20 h-20 text-teal-500 mb-6 drop-shadow-lg" />
                        <h3 className="text-4xl font-black text-teal-600 mb-2 font-cursive">Alhamdulillah!</h3>
                        <p className="text-slate-600 font-medium mb-8 text-center text-lg">Gambarnya sudah utuh kembali.</p>

                        <div className="w-[200px] h-[200px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-8">
                            <img src="/kids/puzzle_masjid.png" alt="Masjid" className="w-full h-full object-cover" />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetGame}
                            className="bg-teal-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 hover:bg-teal-600 transition"
                        >
                            Main Lagi <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default PuzzleMasjid;
