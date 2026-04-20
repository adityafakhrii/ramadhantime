import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, PartyPopper, ArrowRight } from 'lucide-react';

const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const HitungBintang: FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [starCount, setStarCount] = useState(0);
    const [options, setOptions] = useState<number[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [wrongChoice, setWrongChoice] = useState<number | null>(null);

    const generateRound = () => {
        const count = Math.floor(Math.random() * 8) + 2; // 2 to 9 stars
        setStarCount(count);

        let wrong1 = count + 1;
        let wrong2 = count - 1;
        if (wrong2 <= 0) wrong2 = count + 2;

        setOptions(shuffle([count, wrong1, wrong2]));
        setShowSuccess(false);
        setWrongChoice(null);
    };

    useEffect(() => {
        generateRound();
    }, []);

    const handleChoice = (opt: number) => {
        if (showSuccess) return;
        if (opt === starCount) {
            setShowSuccess(true);
        } else {
            setWrongChoice(opt);
            setTimeout(() => setWrongChoice(null), 500);
        }
    };

    if (!starCount) return null;

    return (
        <div className="w-full h-full bg-indigo-900 flex flex-col items-center pt-20 pb-10 px-6 relative overflow-hidden font-sans">
            <h2 className="text-3xl font-black text-amber-300 font-cursive tracking-wider absolute top-8 drop-shadow-md z-10">Hitung Bintang</h2>

            <AnimatePresence mode="wait">
                {!showSuccess ? (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="flex-1 flex flex-col items-center w-full z-10"
                    >
                        <p className="text-indigo-200 font-medium mb-6 text-center">Ada berapa bintang di langit?</p>

                        <div className="flex-1 flex flex-wrap items-center justify-center gap-4 max-w-[250px] mb-8">
                            {Array.from({ length: starCount }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, rotate: -30 }}
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 5, -5, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.1
                                    }}
                                >
                                    <Star className="w-12 h-12 text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full max-w-sm mt-auto">
                            {options.map((opt, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={wrongChoice === opt ? { x: [-5, 5, -5, 5, 0] } : {}}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => handleChoice(opt)}
                                    className={`aspect-square rounded-2xl flex items-center justify-center text-4xl font-black shadow-lg border-b-4 ${wrongChoice === opt
                                            ? 'bg-rose-500 border-rose-700 text-white'
                                            : 'bg-indigo-500 border-indigo-700 text-amber-300 hover:bg-indigo-400'
                                        }`}
                                >
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center w-full z-10"
                    >
                        <PartyPopper className="w-20 h-20 text-amber-400 mb-6 drop-shadow-lg" />
                        <h3 className="text-4xl font-black text-white mb-2 font-cursive">Alhamdulillah!</h3>
                        <p className="text-indigo-200 font-medium mb-8 text-center text-lg">Jawabanmu benar, <br />ada <strong>{starCount} bintang!</strong></p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={generateRound}
                            className="bg-amber-400 text-indigo-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 hover:bg-amber-300 transition"
                        >
                            Main Lagi <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Night sky background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-800 via-indigo-900 to-black z-0"></div>
        </div>
    );
};
export default HitungBintang;
