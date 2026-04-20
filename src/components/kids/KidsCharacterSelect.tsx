import { FC } from 'react';
import { KidsCharacter } from '@/pages/KidsMode';
import { ChevronLeft, Moon, BookOpen, Gamepad2, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
    onSelect: (character: KidsCharacter) => void;
}

const KidsCharacterSelect: FC<Props> = ({ onSelect }) => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen max-w-md mx-auto flex overflow-hidden font-sans shadow-2xl bg-white">
            {/* Back button to return to main app */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-4 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border hover:bg-white"
            >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>

            {/* Title */}
            <div className="absolute top-16 w-full flex justify-center z-40 pointer-events-none">
                <h1 className="text-5xl font-extrabold text-amber-800 drop-shadow-md tracking-wider flex items-center gap-2" style={{ fontFamily: 'cursive' }}>
                    <span>Mili</span>
                    <span className="text-slate-700 font-serif">Tan</span>
                </h1>
            </div>

            {/* Left side: Mili */}
            <div
                className="flex-1 cursor-pointer flex items-center justify-end relative group px-2 pb-16"
                onClick={() => onSelect('mili')}
            >
                <div className="absolute inset-0 bg-[#e6d0c2] group-hover:bg-[#dabeaf] transition-colors duration-300"></div>
                {/* Image for Mili Character */}
                <div className="z-10 w-full h-[80%] flex flex-col items-center justify-center transform transition group-hover:scale-105 relative">
                    <img
                        src="/kids/mili.png"
                        alt="Mili"
                        className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl saturate-110"
                    />
                    <div className="absolute text-white font-black text-3xl bottom-4 tracking-widest drop-shadow-md">Mili</div>
                </div>
            </div>

            {/* Right side: Tan */}
            <div
                className="flex-1 cursor-pointer flex items-center justify-start relative border-l-4 border-white/40 group px-2 pb-16"
                onClick={() => onSelect('tan')}
            >
                <div className="absolute inset-0 bg-[#7d7c71] group-hover:bg-[#6c6b61] transition-colors duration-300"></div>
                {/* Image for Tan Character Graphic */}
                <div className="z-10 w-full h-[80%] flex flex-col items-center justify-center transform transition group-hover:scale-105 relative">
                    <img
                        src="/kids/tan.png"
                        alt="Tan"
                        className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl saturate-110"
                    />
                    <div className="absolute text-white font-black text-3xl bottom-4 tracking-widest drop-shadow-md">Tan</div>
                </div>
            </div>

            {/* Bottom Nav Placeholder for selection screen */}
            <div className="absolute bottom-0 w-full bg-[#525146] py-3 flex justify-evenly px-4 z-40 border-t items-end rounded-t-2xl shadow-[0_-10px_20px_rgba(0,0,0,0.15)]">
                <div className="flex flex-col items-center text-white/50 text-xs gap-1 font-medium pb-2">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-inner">
                        <div className="w-10 h-10 rounded-full bg-amber-500 shadow-md flex items-center justify-center">
                            <Moon className="w-5 h-5 text-white fill-white" />
                        </div>
                    </div>
                    Hari ini
                </div>
                <div className="flex flex-col items-center text-white/50 text-xs gap-1 font-medium pb-2">
                    <div className="w-10 h-10 rounded-full bg-red-600 shadow-md flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    Belajar
                </div>
                <div className="flex flex-col items-center text-white/50 text-xs gap-1 font-medium pb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500 shadow-md flex items-center justify-center">
                        <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    Bermain
                </div>
                <div className="flex flex-col items-center text-white/50 text-xs gap-1 font-medium pb-2">
                    <div className="w-10 h-10 rounded-full bg-amber-400 shadow-md flex items-center justify-center">
                        <Palette className="w-5 h-5 text-white" />
                    </div>
                    Berkarya
                </div>
            </div>
        </div>
    );
};
export default KidsCharacterSelect;
