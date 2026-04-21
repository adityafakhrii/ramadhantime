import { FC, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useVoiceTransformer } from '../hooks/useVoiceTransformer';

interface Props {
    character: 'mili' | 'tan';
    onSpeakingChange?: (isSpeaking: boolean) => void;
}

export const TalkingCharacterModule: FC<Props> = ({ character, onSpeakingChange }) => {
    const { isRecording, isPlaying, audioData, startRecording, stopRecording } = useVoiceTransformer();

    useEffect(() => {
        if (onSpeakingChange) {
            onSpeakingChange(isRecording || isPlaying);
        }
    }, [isRecording, isPlaying, onSpeakingChange]);

    const handlePointerDown = () => {
        if (!isRecording && !isPlaying) {
            startRecording();
        }
    };

    const handlePointerUp = () => {
        if (isRecording) {
            stopRecording(character);
        }
    };

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50">
            {/* Waveform Visualization */}
            <div className={`flex items-end justify-center gap-1 h-12 transition-opacity duration-300 ${isRecording || isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                {audioData.map((val, i) => (
                    <div
                        key={i}
                        className={`w-1.5 rounded-full ${isRecording ? 'bg-red-400' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'}`}
                        style={{ height: `${Math.max(4, (val / 255) * 48)}px`, transition: 'height 50ms ease-out' }}
                    />
                ))}
            </div>

            {/* Mic Button */}
            <button
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                // Preclude context menu on long-press (mobile)
                onContextMenu={(e) => e.preventDefault()}
                className={`
                    relative group flex items-center justify-center w-20 h-20 rounded-full shadow-2xl transition-all duration-300
                    ${isRecording ? 'bg-red-500 scale-110' : isPlaying ? 'bg-emerald-500' : 'bg-slate-800 hover:bg-slate-700 hover:scale-105 active:scale-95'}
                    border-4 border-white/80 touch-none select-none
                `}
            >
                {/* Pulse ring when recording */}
                {isRecording && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75" />
                )}

                {isPlaying ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin relative z-10" />
                ) : isRecording ? (
                    <Square className="w-8 h-8 text-white fill-current relative z-10" />
                ) : (
                    <Mic className="w-10 h-10 text-white relative z-10" />
                )}
            </button>

            <p className="text-white/90 font-bold bg-black/40 px-4 py-1 rounded-full text-sm backdrop-blur-sm pointer-events-none select-none">
                {isRecording ? 'Lepas untuk memutar...' : isPlaying ? 'Mendengarkan...' : 'Tahan & Bicara'}
            </p>
        </div>
    );
};
