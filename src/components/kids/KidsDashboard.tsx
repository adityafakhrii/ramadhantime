import { FC, useState } from 'react';
import { KidsCharacter } from '@/pages/KidsMode';
import KidsTopBar from './KidsTopBar';
import KidsBottomNav from './KidsBottomNav';
import KidsTodayView from './views/KidsTodayView';
import KidsStudyView from './views/KidsStudyView';
import KidsPlayView from './views/KidsPlayView';
import KidsArtView from './views/KidsArtView';

interface Props {
    character: KidsCharacter;
    onBack: () => void;
}

export type KidsViewType = 'today' | 'study' | 'play' | 'art';

const KidsDashboard: FC<Props> = ({ character, onBack }) => {
    const [activeView, setActiveView] = useState<KidsViewType>('today');

    return (
        <div className="relative h-screen max-w-md mx-auto flex flex-col overflow-hidden bg-slate-50 font-sans shadow-2xl">
            {/* Top Bar floats over content */}
            <div className="absolute top-0 left-0 w-full z-40">
                <KidsTopBar character={character} onBack={onBack} activeView={activeView} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col h-full w-full">
                {activeView === 'today' && <KidsTodayView character={character} />}
                {activeView === 'study' && <KidsStudyView character={character} />}
                {activeView === 'play' && <KidsPlayView character={character} />}
                {activeView === 'art' && <KidsArtView character={character} />}
            </div>

            {/* Bottom Nav */}
            <div className="z-40">
                <KidsBottomNav activeView={activeView} onViewChange={setActiveView} character={character} />
            </div>
        </div>
    );
};
export default KidsDashboard;
