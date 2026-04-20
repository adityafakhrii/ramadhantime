import { FC } from 'react';
import { KidsCharacter } from '@/pages/KidsMode';
import { BookOpen, Star, PlayCircle } from 'lucide-react';

const KidsStudyView: FC<{ character: KidsCharacter }> = ({ character }) => {
    return (
        <div className="absolute inset-0 bg-[#fef7f0] pt-24 pb-32 px-6 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-2xl">
                    <BookOpen className="w-8 h-8 text-red-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Ruang Belajar</h2>
                    <p className="text-sm text-slate-500 font-medium">Waktunya membaca cerita!</p>
                </div>
            </div>

            <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
                        <div className="w-20 h-20 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Star className="text-amber-400 w-8 h-8" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-800 text-lg">Kisah Inspiratif {i}</h3>
                            <p className="text-xs text-slate-400 line-clamp-2 mt-1">Sebuah cerita storytelling yang penuh hikmah dan pesan moral untuk anak-anak yang shalih.</p>
                        </div>
                        <button className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors flex-shrink-0">
                            <PlayCircle className="w-8 h-8" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default KidsStudyView;
