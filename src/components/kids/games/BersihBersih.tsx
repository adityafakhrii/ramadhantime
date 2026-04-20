import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, PartyPopper, ArrowRight, Sparkles } from 'lucide-react';

const TRASH_TYPES = ['🍌', '📄', '🥤', '🍂'];

const generateTrashItems = () => {
    return Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        type: TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)],
        x: Math.random() * 80 + 10, // 10% to 90%
        y: Math.random() * 40 + 20, // 20% to 60%
        rotation: Math.random() * 360,
    }));
};

const BersihBersih: FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [trashes, setTrashes] = useState(generateTrashItems());
    const [showSuccess, setShowSuccess] = useState(false);

    const handleClean = (id: number) => {
        setTrashes(prev => prev.filter(t => t.id !== id));
    };

    useEffect(() => {
        if (trashes.length === 0) {
            setTimeout(() => setShowSuccess(true), 500);
        }
    }, [trashes]);

    const resetGame = () => {
        setTrashes(generateTrashItems());
        setShowSuccess(false);
    };

    return (
        <div className="w-full h-full bg-emerald-50 flex flex-col items-center pt-20 pb-10 px-6 relative overflow-hidden font-sans">
            <h2 className="text-3xl font-black text-emerald-600 font-cursive tracking-wider absolute top-8 z-10 drop-shadow-sm">Bersih-Bersih</h2>

            <AnimatePresence mode="wait">
                {!showSuccess ? (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 w-full relative"
                    >
                        {/* Status bar */}
                        <div className="absolute top-0 w-full flex justify-center z-20">
                            <div className="bg-white px-6 py-2 rounded-full shadow-sm border border-emerald-100 font-bold text-emerald-500">
                                Sisa Sampah: <span className="text-xl">{trashes.length}</span>
                            </div>
                        </div>

                        {/* Trash Area */}
                        <div className="w-full h-3/4 relative mt-16 bg-white/40 rounded-3xl border-4 border-dashed border-emerald-200">
                            <AnimatePresence>
                                {trashes.map((trash) => (
                                    <motion.button
                                        key={trash.id}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{
                                            opacity: 0,
                                            scale: 0.5,
                                            y: 200,
                                            x: "50%",
                                            transition: { duration: 0.5 }
                                        }}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.8 }}
                                        onClick={() => handleClean(trash.id)}
                                        className="absolute text-4xl w-14 h-14 flex items-center justify-center drop-shadow-md cursor-pointer filter hover:brightness-110"
                                        style={{
                                            left: `${trash.x}%`,
                                            top: `${trash.y}%`,
                                            transform: `rotate(${trash.rotation}deg)`
                                        }}
                                    >
                                        {trash.type}
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Trash Bin graphic */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-24 bg-emerald-500 rounded-b-xl rounded-t-sm shadow-xl flex flex-col items-center justify-center">
                            <div className="w-full h-4 bg-emerald-600 absolute top-0 rounded-t-sm"></div>
                            <Trash2 className="w-10 h-10 text-emerald-100 mt-2" />
                            <span className="text-white font-bold text-xs mt-1">TONG SAMPAH</span>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center w-full z-10"
                    >
                        <Sparkles className="w-20 h-20 text-emerald-500 mb-6 drop-shadow-lg" />
                        <h3 className="text-4xl font-black text-emerald-600 mb-2 font-cursive text-center leading-tight">Masya Allah<br />Bersih!</h3>
                        <p className="text-slate-600 font-medium mb-8 text-center text-lg px-4">Kebersihan itu sebagian dari Iman. Hebat!</p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetGame}
                            className="bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 hover:bg-emerald-600 transition"
                        >
                            Main Lagi <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default BersihBersih;
