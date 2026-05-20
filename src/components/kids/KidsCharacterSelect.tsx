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
        <div className="relative min-h-screen max-w-md mx-auto flex overflow-hidden font-sans shadow-2xl bg-white pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
            {/* Back button to return to main app */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-[calc(env(safe-area-inset-top,0px)+1.5rem)] left-4 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border hover:bg-white"
            >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>

            {/* Title */}
            <div className="absolute top-[calc(env(safe-area-inset-top,0px)+4rem)] w-full flex justify-center z-40 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-8 py-3 rounded-full shadow-lg border-[3px] border-white/60">
                    <h1 className="text-5xl font-extrabold flex items-center gap-2 drop-shadow-sm" style={{ fontFamily: 'cursive' }}>
                        <span className="text-amber-800">Mili</span>
                        <span className="text-slate-700 font-serif">Tan</span>
                    </h1>
                </div>
            </div>

            {/* Left side: Mili */}
            <div
                className="flex-1 cursor-pointer flex items-center justify-end relative group px-2 pb-16 overflow-hidden"
                onClick={() => onSelect('mili')}
            >
                <img src="/kids/bg_mili_kamar.png" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#e6d0c2] via-transparent to-white/20 opacity-90 transition-colors duration-300"></div>
                {/* Image for Mili Character */}
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pt-20">
                    <img
                        src="/kids/mili.png"
                        alt="Mili"
                        className="w-full h-[70%] object-contain saturate-110 transform transition group-hover:scale-105 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]"
                    />
                    <div className="text-white font-black text-4xl mt-2 tracking-widest drop-shadow-md" style={{ textShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>Mili</div>
                </div>
            </div>

            {/* Right side: Tan */}
            <div
                className="flex-1 cursor-pointer flex items-center justify-start relative border-l-4 border-white/40 group px-2 pb-16 overflow-hidden"
                onClick={() => onSelect('tan')}
            >
                <img src="/kids/bg_tan_kamar.png" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#525146] via-transparent to-black/20 opacity-90 transition-colors duration-300"></div>
                {/* Image for Tan Character Graphic */}
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pt-20">
                    <img
                        src="/kids/tan.png"
                        alt="Tan"
                        className="w-full h-[70%] object-contain saturate-110 transform transition group-hover:scale-105 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]"
                    />
                    <div className="text-white font-black text-4xl mt-2 tracking-widest drop-shadow-md" style={{ textShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>Tan</div>
                </div>
            </div>

        </div>
    );
};
export default KidsCharacterSelect;
