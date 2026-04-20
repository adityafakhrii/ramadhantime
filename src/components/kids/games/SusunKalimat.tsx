import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { PartyPopper, ArrowRight } from 'lucide-react';

const SENTENCES = [
    { target: ['Al', 'ham', 'du', 'lil', 'lah'], fullstr: 'Alhamdulillah', desc: 'Segala puji bagi Allah' },
    { target: ['Bis', 'mil', 'lah'], fullstr: 'Bismillah', desc: 'Dengan menyebut nama Allah' },
    { target: ['Sub', 'ha', 'nal', 'lah'], fullstr: 'Subhanallah', desc: 'Maha Suci Allah' }
];

const shuffle = (array: string[]) => {
    let sorted = [...array];
    while (sorted.join('') === array.join('')) {
        sorted.sort(() => Math.random() - 0.5);
    }
    return sorted;
};

const SusunKalimat: FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [round, setRound] = useState(0);
    const [items, setItems] = useState<string[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const currentSentence = SENTENCES[round % SENTENCES.length];

    useEffect(() => {
        setItems(shuffle(currentSentence.target));
        setShowSuccess(false);
    }, [round]);

    const handleReorder = (newOrder: string[]) => {
        setItems(newOrder);
        if (newOrder.join('') === currentSentence.target.join('')) {
            setTimeout(() => setShowSuccess(true), 400);
        }
    };

    const nextRound = () => {
        setRound(r => r + 1);
    };

    return (
        <div className="w-full h-full bg-amber-50 flex flex-col items-center pt-20 pb-10 px-6 relative overflow-hidden font-sans">
            <h2 className="text-3xl font-black text-amber-600 font-cursive tracking-wider absolute top-8 z-10 drop-shadow-sm">Susun Kalimat</h2>
            <p className="text-amber-600/70 font-medium absolute top-20">Geser untuk menyusun urutan kalimat</p>

            <AnimatePresence mode="wait">
                {!showSuccess ? (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 w-full flex items-center justify-center relative z-20"
                    >
                        {/* Empty droppable slots indication */}
                        <div className="absolute flex gap-3 opacity-20 pointer-events-none">
                            {currentSentence.target.map((_, i) => (
                                <div key={i} className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-dashed border-amber-800 rounded-2xl"></div>
                            ))}
                        </div>

                        <Reorder.Group
                            axis="x"
                            values={items}
                            onReorder={handleReorder}
                            className="flex gap-3 relative z-30 flex-wrap justify-center w-full max-w-sm"
                        >
                            {items.map((item) => (
                                <Reorder.Item
                                    key={item}
                                    value={item}
                                    className="bg-white px-5 sm:px-6 py-4 rounded-b-xl rounded-t-sm shadow-lg border-b-4 border-amber-400 cursor-grab active:cursor-grabbing hover:bg-amber-100 transition-colors"
                                    whileDrag={{ scale: 1.1, zIndex: 50, rotate: rotateRandom() }}
                                >
                                    <span className="text-2xl font-black text-amber-700">{item}</span>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center w-full z-10"
                    >
                        <PartyPopper className="w-20 h-20 text-amber-500 mb-6 drop-shadow-lg" />
                        <h3 className="text-4xl font-black text-amber-600 mb-2 font-cursive">Alhamdulillah!</h3>

                        <div className="bg-white/60 p-6 rounded-3xl border border-amber-200 text-center mb-8 w-full max-w-sm">
                            <h4 className="text-3xl font-black text-amber-500 mb-2">{currentSentence.fullstr}</h4>
                            <p className="text-amber-800 font-medium">"{currentSentence.desc}"</p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={nextRound}
                            className="bg-amber-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 hover:bg-amber-600 transition"
                        >
                            Lanjut <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Helper for slight rotation during drag to look fun
const rotateRandom = () => (Math.random() > 0.5 ? 5 : -5);

export default SusunKalimat;
