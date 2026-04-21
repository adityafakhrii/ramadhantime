import { useState, useRef, useEffect, useCallback } from 'react';

export const useVoiceTransformer = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPermissionGranted, setIsPermissionGranted] = useState(false);
    const [audioData, setAudioData] = useState<number[]>(new Array(30).fill(0));

    const mediaStreamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number>();

    const getAudioContext = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioContextRef.current;
    };

    const initMicrophone = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
            mediaStreamRef.current = stream;
            setIsPermissionGranted(true);
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };
            return true;
        } catch (err) {
            console.error('Microphone access denied:', err);
            setIsPermissionGranted(false);
            return false;
        }
    };

    const updateWaveform = useCallback(() => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Simple downsample to 30 bars
        const step = Math.floor(dataArray.length / 30);
        const bars = [];
        for (let i = 0; i < 30; i++) {
            bars.push(dataArray[i * step] || 0);
        }
        setAudioData(bars);
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
    }, []);

    const startRecording = async () => {
        if (isPlaying) return;

        let streamReady = isPermissionGranted;
        if (!streamReady) {
            streamReady = await initMicrophone();
        }

        if (!streamReady || !mediaRecorderRef.current) return;

        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        audioChunksRef.current = [];

        // Setup analyser for mic input waveform
        const source = ctx.createMediaStreamSource(mediaStreamRef.current!);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        source.connect(analyser); // No connection to destination to avoid feedback loops!

        updateWaveform();

        mediaRecorderRef.current.start(100);
        setIsRecording(true);
    };

    const stopRecording = (character: 'mili' | 'tan') => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;

        return new Promise<void>((resolve) => {
            mediaRecorderRef.current!.onstop = async () => {
                setIsRecording(false);

                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }

                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await playTransformed(audioBlob, character);
                resolve();
            };
            mediaRecorderRef.current!.stop();
        });
    };

    const playTransformed = async (audioBlob: Blob, character: 'mili' | 'tan') => {
        try {
            setIsPlaying(true);
            const arrayBuffer = await audioBlob.arrayBuffer();
            const ctx = getAudioContext();

            // Need a new analyser for playback
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;
            updateWaveform();

            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            sourceNodeRef.current = source;

            // Pitch & Rate adjustments
            if (character === 'mili') {
                source.playbackRate.value = 1.35; // Cute girl pitch
            } else {
                source.playbackRate.value = 1.15; // Playful boy pitch
            }

            source.connect(analyser);
            analyser.connect(ctx.destination);

            source.onended = () => {
                setIsPlaying(false);
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
                setAudioData(new Array(30).fill(0));
            };

            source.start(0);
        } catch (e) {
            console.error("Audio playback failed", e);
            setIsPlaying(false);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            setAudioData(new Array(30).fill(0));
        }
    };

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            sourceNodeRef.current?.stop();
            // Optional: Close MediaStream tracks
            mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, []);

    return {
        isRecording,
        isPlaying,
        audioData,
        startRecording,
        stopRecording
    };
};
