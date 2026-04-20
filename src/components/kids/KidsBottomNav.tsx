import { FC } from 'react';
import { KidsViewType } from './KidsDashboard';
import { Moon, BookOpen, Gamepad2, Palette } from 'lucide-react';
import { KidsCharacter } from '@/pages/KidsMode';

interface Props {
    activeView: KidsViewType;
    onViewChange: (view: KidsViewType) => void;
    character: KidsCharacter;
}

const KidsBottomNav: FC<Props> = ({ activeView, onViewChange, character }) => {
    const bgClass = character === 'mili' ? 'bg-[#7c4433]' : 'bg-[#525146]';

    return (
        <div className={`w-full ${bgClass} py-3 flex justify-evenly px-4 border-t items-end rounded-t-2xl shadow-[0_-10px_20px_rgba(0,0,0,0.15)]`}>
            <NavButton
                active={activeView === 'today'}
                icon={<Moon className="w-5 h-5 text-white fill-white" />}
                label="Hari ini"
                onClick={() => onViewChange('today')}
                color="bg-amber-500"
            />
            <NavButton
                active={activeView === 'study'}
                icon={<BookOpen className="w-5 h-5 text-white" />}
                label="Belajar"
                onClick={() => onViewChange('study')}
                color="bg-red-600"
            />
            <NavButton
                active={activeView === 'play'}
                icon={<Gamepad2 className="w-5 h-5 text-white" />}
                label="Bermain"
                onClick={() => onViewChange('play')}
                color="bg-blue-500"
            />
            <NavButton
                active={activeView === 'art'}
                icon={<Palette className="w-5 h-5 text-white" />}
                label="Berkarya"
                onClick={() => onViewChange('art')}
                color="bg-amber-400"
            />
        </div>
    );
};

function NavButton({ active, icon, label, onClick, color }: { active: boolean, icon: any, label: string, onClick: () => void, color: string }) {
    return (
        <div
            className={`flex flex-col items-center gap-1 font-medium pb-2 cursor-pointer transition-all ${active ? 'text-white' : 'text-white/70'} text-xs`}
            onClick={onClick}
        >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${active ? 'bg-white shadow-inner scale-110 mb-1' : 'bg-transparent'}`}>
                <div className={`w-10 h-10 rounded-full ${color} shadow-md flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
            {label}
        </div>
    )
}

export default KidsBottomNav;
