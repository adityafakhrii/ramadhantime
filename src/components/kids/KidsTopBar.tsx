import { FC } from 'react';
import { KidsCharacter } from '@/pages/KidsMode';
import { KidsViewType } from './KidsDashboard';
import { ChevronLeft, CloudSun, Sun } from 'lucide-react';

interface Props {
    character: KidsCharacter;
    activeView: KidsViewType;
    onBack: () => void;
}

const KidsTopBar: FC<Props> = ({ character, activeView, onBack }) => {
    const isMili = character === 'mili';
    const name = isMili ? 'Mili' : 'Tan';

    return (
        <div className="w-full flex items-center justify-between p-4 pt-6 drop-shadow-md">
            {/* Character Profile / Back */}
            <div
                className="flex items-center gap-2 cursor-pointer bg-white/70 backdrop-blur-sm pr-4 pl-1 py-1 rounded-full border border-white/50 shadow-sm"
                onClick={onBack}
            >
                <div className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-inner overflow-hidden ${isMili ? 'bg-[#8eb28d]' : 'bg-[#4a7eb4]'}`}>
                    {/* Tiny placeholder for the character face icon */}
                    <div className="w-6 h-6 bg-[#ecd2b3] rounded-full"></div>
                </div>
                <span className="font-bold text-slate-800 font-sans tracking-wide" style={{ fontFamily: 'cursive', fontSize: '1.25rem' }}>{name}</span>
            </div>

            {/* Info Widgets: Time, Weather */}
            <div className="flex gap-2">
                {/* Next Prayer Box */}
                <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden divide-x divide-slate-100 h-12">
                    <div className="px-3 flex flex-col justify-center items-center">
                        <span className="text-[10px] text-slate-500 font-medium">Selanjutnya</span>
                        <span className="text-xs font-bold text-slate-700">Dzuhur</span>
                        <span className="font-bold text-slate-800">12.07</span>
                    </div>
                    <div className="px-3 flex items-center justify-center">
                        <Sun className="w-6 h-6 text-amber-500 fill-amber-500" />
                    </div>
                </div>

                {/* Second Next Prayer / Weather Box */}
                <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden divide-x divide-slate-100 h-12">
                    <div className="px-3 flex flex-col justify-center items-center">
                        <span className="text-[10px] text-slate-500 font-medium">Yang akan datang</span>
                        <span className="text-xs font-bold text-slate-700">Ashar</span>
                        <span className="font-bold text-slate-800">15.15</span>
                    </div>
                    <div className="px-3 flex items-center justify-center">
                        <CloudSun className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default KidsTopBar;
