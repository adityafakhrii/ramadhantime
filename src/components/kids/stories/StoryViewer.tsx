import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Story } from '../../../data/kidsStories';

interface Props {
    story: Story;
    onClose: () => void;
}

const StoryViewer: FC<Props> = ({ story, onClose }) => {
    const [page, setPage] = useState(0);

    const isCover = page === 0;
    const isFinished = page === story.pages.length + 1;

    const nextPage = () => {
        if (!isFinished) setPage(p => p + 1);
        else onClose();
    };

    const prevPage = () => {
        if (page > 0) setPage(p => p - 1);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col font-sans">
            {/* Header controls */}
            <div className="absolute top-4 left-4 z-50">
                <button
                    onClick={onClose}
                    className="p-3 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <AnimatePresence mode="wait">
                {isCover ? (
                    <motion.div
                        key="cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -50 }}
                        className={`flex-1 w-full h-full ${story.coverColor} flex flex-col items-center justify-center p-6 relative`}
                    >
                        <div className="w-[80%] max-w-sm aspect-[4/5] bg-white rounded-3xl shadow-2xl p-4 transform -rotate-2 relative z-10 border-4 border-white/50">
                            <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <h1 className="text-4xl font-black text-white text-center mt-8 drop-shadow-lg font-cursive">{story.title}</h1>
                        <p className="text-white/80 font-medium text-center mt-2 px-6">{story.description}</p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={nextPage}
                            className="mt-12 bg-white text-slate-800 px-10 py-4 rounded-full font-bold text-xl shadow-xl flex items-center gap-2"
                        >
                            Mulai Membaca <ChevronRight className="w-6 h-6" />
                        </motion.button>

                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent rotate-12 blur-3xl z-0 pointer-events-none"></div>
                    </motion.div>
                ) : !isFinished ? (
                    <motion.div
                        key={`page-${page}`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="flex-1 w-full h-full relative bg-slate-900"
                    >
                        <img
                            src={story.pages[page - 1].image}
                            alt={`Halaman ${page}`}
                            className="w-full h-full object-cover opacity-80"
                        />

                        {/* Text Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-6 pb-12 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-4 border-white/20 transform hover:-translate-y-1 transition duration-300">
                                <p className="text-xl sm:text-2xl text-slate-800 font-medium leading-relaxed font-sans cursor-pointer" onClick={nextPage}>
                                    {story.pages[page - 1].text}
                                </p>
                            </div>
                        </div>

                        {/* Navigation areas */}
                        <div className="absolute inset-y-0 left-0 w-1/4 z-10 cursor-pointer" onClick={prevPage}></div>
                        <div className="absolute inset-y-0 right-0 w-3/4 z-10 cursor-pointer" onClick={nextPage}></div>

                        {/* Progress */}
                        <div className="absolute top-6 w-full px-16 flex gap-1 justify-center z-50 pointer-events-none">
                            {story.pages.map((_, i) => (
                                <div key={i} className={`h-1.5 rounded-full flex-1 ${i <= page - 1 ? 'bg-white' : 'bg-white/30'}`} />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="end"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 w-full h-full bg-slate-800 flex flex-col items-center justify-center p-6 text-center"
                    >
                        <div className="w-32 h-32 bg-amber-400/20 rounded-full flex items-center justify-center mb-6">
                            <Star className="w-16 h-16 text-amber-400 fill-amber-400" />
                        </div>
                        <h2 className="text-4xl font-black text-white font-cursive mb-4 drop-shadow-md">Tamat</h2>

                        {story.pages[story.pages.length - 1].moralMessage && (
                            <div className="bg-white/10 border border-white/20 p-6 rounded-3xl mb-12 max-w-sm backdrop-blur-sm">
                                <h4 className="text-amber-400 font-bold mb-2 uppercase tracking-wider text-sm">Pesan Moral:</h4>
                                <p className="text-white text-lg leading-relaxed">{story.pages[story.pages.length - 1].moralMessage}</p>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="bg-white text-slate-800 px-8 py-3 rounded-full font-bold shadow-lg"
                        >
                            Tutup Buku
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default StoryViewer;
