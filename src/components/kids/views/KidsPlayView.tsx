import { FC } from 'react';
import { KidsCharacter } from '@/pages/KidsMode';
import { Gamepad2, Puzzle, Sparkles } from 'lucide-react';

const KidsPlayView: FC<{ character: KidsCharacter }> = ({ character }) => {
    return (
        <div className="absolute inset-0 bg-[#f0f9ff] pt-24 pb-32 px-6 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-2xl">
                    <Gamepad2 className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Ruang Games</h2>
                    <p className="text-sm text-slate-500 font-medium">Bermain sambil belajar, yuk!</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-blue-50 flex flex-col items-center justify-center text-center gap-3 aspect-[4/5] relative overflow-hidden group">
                        <div className="absolute top-2 right-2 text-blue-400 opacity-20 group-hover:scale-150 transition-transform">
                            <Puzzle className="w-16 h-16" />
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center z-10 shadow-inner">
                            <Gamepad2 className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className="font-bold text-slate-700 z-10 leading-tight">Mini Game Edukasi {i}</h3>
                        {i % 3 === 0 && <div className="absolute bottom-2 left-2 animate-pulse"><Sparkles className="text-amber-400 w-6 h-6" /></div>}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default KidsPlayView;
