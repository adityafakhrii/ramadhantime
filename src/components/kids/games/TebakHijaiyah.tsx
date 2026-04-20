import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, ArrowRight, RefreshCcw } from 'lucide-react';

const LETTERS = [
    { char: 'ا', name: 'Alif' },
    { char: 'ب', name: 'Ba' },
    { char: 'ت', name: 'Ta' },
    { char: 'ث', name: 'Tsa' },
    { char: 'ج', name: 'Jim' },
    { char: 'ح', name: 'Ha' },
    { char: 'خ', name: 'Kha' },
    { char: 'د', name: 'Dal' },
    { char: 'ذ', name: 'Dzal' },
    { char: 'ر', name: 'Ra' },
];

const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const TebakHijaiyah: FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [target, setTarget] = useState<any>(null);
    const [options, setOptions] = useState<any[]>([]);
    const [score, setScore] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [wrongChoice, setWrongChoice] = useState<string | null>(null);

    const generateRound = () => {
        const shuffled = shuffle(LETTERS);
        const correct = shuffled[0];
        const currentOptions = shuffle([correct, shuffled[1], shuffled[2]]);

        setTarget(correct);
        setOptions(currentOptions);
        setShowSuccess(false);
        setWrongChoice(null);
    };

    useEffect(() => {
        generateRound();
    }, []);

    const handleChoice = (opt: any) => {
        if (showSuccess) return;
        if (opt.char === target.char) {
            setScore(s => s + 1);
            setShowSuccess(true);
        } else {
            setWrongChoice(opt.char);
            setTimeout(() => setWrongChoice(null), 500);
        }
    };

    if (!target) return null;

    return (
        <div className="w-full h-full bg-rose-50 flex flex-col items-center pt-24 pb-10 px-6 relative overflow-hidden font-sans">
            <h2 className="text-3xl font-black text-rose-600 font-cursive tracking-wider absolute top-8">Tebak Hijaiyah</h2>

            <div className="flex bg-white px-6 py-2 rounded-full shadow-sm border border-rose-100 mb-8 z-10">
                <span className="font-bold text-rose-500">Skor: <span className="text-xl">{score}</span></span>
            </div>

            <AnimatePresence mode="wait">
                {!showSuccess ? (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="flex-1 flex flex-col items-center w-full max-w-sm"
                    >
                        <div className="text-center mb-8">
                            <p className="text-slate-500 font-medium mb-4">Mencari bayangan huruf...</p>
                            <div className="w-40 h-40 bg-slate-800 rounded-3xl mx-auto flex items-center justify-center shadow-inner border-4 border-slate-700">
                                <span className="text-8xl text-slate-800 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" style={{ transform: 'scale(1.2)' }}>{target.char}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full">
                            {options.map((opt, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={wrongChoice === opt.char ? { x: [-5, 5, -5, 5, 0] } : {}}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => handleChoice(opt)}
                                    className={`aspect-square rounded-2xl flex items-center justify-center text-5xl bg-white shadow-lg border-4 ${wrongChoice === opt.char ? 'border-red-400 bg-red-50' : 'border-rose-200'}`}
                                >
                                    <span className="text-rose-600 drop-shadow-sm">{opt.char}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center w-full"
                    >
                        <PartyPopper className="w-20 h-20 text-rose-500 mb-6 drop-shadow-lg" />
                        <h3 className="text-4xl font-black text-rose-600 mb-2 font-cursive">Masya Allah!</h3>
                        <p className="text-slate-600 font-medium mb-8">Itu adalah huruf <strong className="text-rose-500 text-xl">{target.name}</strong></p>

                        <div className="w-32 h-32 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-xl border-4 border-rose-300 mb-10">
                            <span className="text-7xl text-rose-500 drop-shadow-md">{target.char}</span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={generateRound}
                            className="bg-rose-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 hover:bg-rose-600 transition"
                        >
                            Lanjut <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confetti or decorative elements */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-200 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-300 rounded-full blur-3xl opacity-50"></div>
        </div>
    );
};
export default TebakHijaiyah;
