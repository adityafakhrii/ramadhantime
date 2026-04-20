import { FC, useState } from 'react';
import { KidsCharacter } from '@/pages/KidsMode';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    character: KidsCharacter;
}

const backgrounds = {
    tan: [
        { id: 'kamar', name: 'Kamar Tidur', image: '/kids/bg_tan_kamar.png' },
        { id: 'bola', name: 'Lap bola', image: '/kids/bg_tan_bola.png' },
        { id: 'dokter', name: 'Ruang Dokter', image: '/kids/bg_tan_dokter.png' }
    ],
    mili: [
        { id: 'kamar', name: 'Kamar Tidur', image: '/kids/bg_mili_kamar.png' },
        { id: 'bandara', name: 'Bandara', image: '/kids/bg_mili_bandara.png' },
        { id: 'dapur', name: 'Dapur', image: '/kids/bg_mili_dapur.png' }
    ]
};

const KidsTodayView: FC<Props> = ({ character }) => {
    const isMili = character === 'mili';
    const bgList = backgrounds[character || 'tan'];
    const [bgIndex, setBgIndex] = useState(0);
    const [showBubble, setShowBubble] = useState(true);

    const prevBg = () => setBgIndex((prev) => (prev > 0 ? prev - 1 : bgList.length - 1));
    const nextBg = () => setBgIndex((prev) => (prev < bgList.length - 1 ? prev + 1 : 0));

    const getCharacterImage = (char: string, bgId: string) => {
        if (char === 'tan') {
            if (bgId === 'bola') return '/kids/tan_bola.png';
            if (bgId === 'dokter') return '/kids/tan_dokter.png?v=3';
            return '/kids/tan.png?v=2';
        } else {
            if (bgId === 'bandara') return '/kids/mili_bandara.png';
            if (bgId === 'dapur') return '/kids/mili_dapur.png';
            return '/kids/mili.png?v=2';
        }
    };

    const [interactionModal, setInteractionModal] = useState<{ show: boolean, type: string, message: string }>({ show: false, type: '', message: '' });

    const handleSideButtonClick = (label: string) => {
        let message = '';
        if (label === 'Tadarus') message = 'Masya Allah! Bacaan Al-Quran kamu hari ini luar biasa! Jangan lupa diulang ya! ⭐';
        if (label === 'Shaum') message = 'Wah, hebat! Semangat puasanya hari ini, Insya Allah penuh berkah. 🌙';
        if (label === 'Tabungan') message = 'Alhamdulillah! Sedikit demi sedikit lama-lama jadi bukit. Terus semangat bertabung! 💰';

        setInteractionModal({ show: true, type: label, message });
    };

    const currentBg = bgList[bgIndex];

    return (
        <div className={`absolute inset-0 flex items-center justify-center bg-white`}>
            <img
                key={currentBg.id}
                src={currentBg.image}
                alt={currentBg.name}
                className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 animate-in fade-in"
            />

            {/* Background Name Indicator */}
            <div className="absolute top-28 w-full flex justify-center z-10 pointer-events-none">
                <div className="bg-white/95 backdrop-blur-md px-8 py-2.5 rounded-full shadow-lg border-2 border-white/50">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest drop-shadow-sm">{currentBg.name}</h2>
                </div>
            </div>

            {/* Controls for swipe/carousel */}
            <button onClick={prevBg} className="absolute left-4 top-[65%] -translate-y-1/2 z-40 p-2.5 bg-slate-800/40 backdrop-blur-md rounded-full text-white/90 hover:text-white hover:bg-slate-800/60 transition-all shadow-lg border border-white/20">
                <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
            </button>
            <button onClick={nextBg} className="absolute right-4 top-[65%] -translate-y-1/2 z-40 p-2.5 bg-slate-800/40 backdrop-blur-md rounded-full text-white/90 hover:text-white hover:bg-slate-800/60 transition-all shadow-lg border border-white/20">
                <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
            </button>

            {/* Character Graphic */}
            <div className="z-20 transform transition-transform hover:scale-105 duration-300 relative mt-24 cursor-pointer" onClick={() => setShowBubble(!showBubble)}>
                {/* Speech Bubble Reminder Prototype */}
                <div className={`absolute -top-16 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border-2 border-slate-200 transition-all duration-300 origin-bottom ${showBubble ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} z-50`}>
                    <p className="text-base sm:text-lg font-bold text-slate-800 whitespace-nowrap text-center">Sudah Tadarus<br />hari ini?</p>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white/95 border-b-2 border-r-2 border-slate-200 transform rotate-45"></div>
                </div>

                {isMili ? (
                    <img
                        src={getCharacterImage('mili', currentBg.id)}
                        alt="Mili"
                        className="w-[20rem] sm:w-[24rem] md:w-[28rem] h-auto object-contain saturate-110 filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)] transition-transform hover:scale-105 duration-300 relative z-20"
                    />
                ) : (
                    <img
                        src={getCharacterImage('tan', currentBg.id)}
                        alt="Tan"
                        className="w-[20rem] sm:w-[24rem] md:w-[28rem] h-auto object-contain saturate-110 filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)] transition-transform hover:scale-105 duration-300 relative z-20"
                    />
                )}
            </div>

            {/* Sidebar widget */}
            <div className="absolute right-4 top-1/4 flex flex-col gap-4 z-40">
                <SideButton label="Tadarus" color="bg-[#78b368]" onClick={() => handleSideButtonClick('Tadarus')} />
                <SideButton label="Shaum" color="bg-[#568cc3]" onClick={() => handleSideButtonClick('Shaum')} />
                <SideButton label="Tabungan" color="bg-[#6b7ba9]" onClick={() => handleSideButtonClick('Tabungan')} />
            </div>

            {/* Interaction Modal overlay */}
            {interactionModal.show && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setInteractionModal({ show: false, type: '', message: '' })}></div>
                    <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border-4 border-white animate-in zoom-in-95 duration-200 text-center flex flex-col items-center">
                        <div className={`w-20 h-20 rounded-full mb-4 shadow-inner flex items-center justify-center text-4xl
                            ${interactionModal.type === 'Tadarus' && 'bg-green-100 border-4 border-green-200'}
                            ${interactionModal.type === 'Shaum' && 'bg-blue-100 border-4 border-blue-200'}
                            ${interactionModal.type === 'Tabungan' && 'bg-indigo-100 border-4 border-indigo-200'}
                        `}>
                            {interactionModal.type === 'Tadarus' && '📖'}
                            {interactionModal.type === 'Shaum' && '🌙'}
                            {interactionModal.type === 'Tabungan' && '💰'}
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2 font-cursive tracking-wide">{interactionModal.type}!</h3>
                        <p className="text-slate-600 font-medium leading-relaxed mb-6">
                            {interactionModal.message}
                        </p>
                        <button
                            className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold py-3 px-8 rounded-full shadow-md transform transition hover:scale-105 active:scale-95 w-full"
                            onClick={() => setInteractionModal({ show: false, type: '', message: '' })}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

function SideButton({ label, color, onClick }: { label: string, color: string, onClick?: () => void }) {
    return (
        <div onClick={onClick} className={`w-14 h-14 rounded-full ${color} shadow-lg border-[3px] border-white/60 flex flex-col items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform active:scale-95`}>
            <span className="text-[9px] font-bold text-center tracking-wider px-1">{label}</span>
        </div>
    )
}

export default KidsTodayView;
