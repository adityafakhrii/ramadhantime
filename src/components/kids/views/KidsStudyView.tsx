import { FC, useState } from 'react';
import { KidsCharacter } from '@/pages/KidsMode';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { KIDS_STORIES, Story } from '../../../data/kidsStories';
import StoryViewer from '../stories/StoryViewer';

interface Props {
    character: KidsCharacter;
}

const KidsStudyView: FC<Props> = ({ character }) => {
    const [activeStory, setActiveStory] = useState<Story | null>(null);

    return (
        <div className="absolute inset-0 bg-[#f4f7fb] pt-24 pb-20 overflow-y-auto">
            <h2 className="text-center font-black text-slate-800 text-3xl tracking-wider mb-10 mt-4" style={{ fontFamily: 'cursive' }}>Kisah Inspiratif</h2>

            <div className="w-full px-6 flex flex-col items-center justify-center gap-8 pb-12">
                {KIDS_STORIES && KIDS_STORIES.length > 0 ? (
                    KIDS_STORIES.map((story) => (
                        <motion.div
                            key={story.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-[280px] h-[380px] relative cursor-pointer"
                            onClick={() => setActiveStory(story)}
                        >
                            {/* Simple Book Design */}
                            <div className={`w-full h-full ${story.coverColor} rounded-r-3xl rounded-l-md shadow-2xl p-2 border-l-8 border-white/40 flex flex-col`}>
                                {/* Image Container */}
                                <div className="w-full h-3/5 bg-white rounded-tr-2xl rounded-tl-sm overflow-hidden border-4 border-white">
                                    {story.coverImage ? (
                                        <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">No Cover</div>
                                    )}
                                </div>

                                {/* Text Container */}
                                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                                    <h3 className="font-black text-white text-xl leading-snug drop-shadow-md" style={{ fontFamily: 'cursive' }}>{story.title}</h3>
                                    <div className="flex items-center gap-2 mt-4 bg-white text-amber-500 font-black px-4 py-2 rounded-full shadow-md">
                                        <BookOpen className="w-5 h-5" />
                                        <span>BACA CERITA</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="p-6 bg-rose-100 text-rose-500 rounded-2xl font-bold">
                        DATA CERITA KOSONG!
                    </div>
                )}
            </div>

            <AnimatePresence>
                {activeStory && (
                    <StoryViewer
                        story={activeStory}
                        onClose={() => setActiveStory(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default KidsStudyView;
