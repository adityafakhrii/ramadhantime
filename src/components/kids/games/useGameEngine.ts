import { useState, useEffect } from 'react';

export type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER' | 'COMPLETED';

export interface GameEngineOptions {
    gameId: string;
    maxLives?: number;
    maxLevel?: number;
}

export const useGameEngine = ({ gameId, maxLives = 3, maxLevel = 5 }: GameEngineOptions) => {
    // 1. Core State
    const [status, setStatus] = useState<GameState>('MENU');
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(maxLives);
    const [score, setScore] = useState(0);
    const [hasSave, setHasSave] = useState(false);

    // Load Check
    useEffect(() => {
        const saved = localStorage.getItem(`kids_game_${gameId}`);
        if (saved) setHasSave(true);
    }, [gameId]);

    // 2. Actions
    const startGame = (loadSaved: boolean = false) => {
        if (loadSaved) {
            const saved = localStorage.getItem(`kids_game_${gameId}`);
            if (saved) {
                const data = JSON.parse(saved);
                setLevel(data.level || 1);
                setLives(data.lives || maxLives);
                setScore(data.score || 0);
                setStatus('PLAYING');
                return;
            }
        }

        // Fresh start
        setLevel(1);
        setLives(maxLives);
        setScore(0);
        setStatus('PLAYING');
        localStorage.removeItem(`kids_game_${gameId}`);
    };

    const saveGame = () => {
        if (status === 'PLAYING') {
            localStorage.setItem(`kids_game_${gameId}`, JSON.stringify({ level, lives, score }));
            setHasSave(true);
        }
    };

    const addScore = (points: number) => {
        setScore(s => s + points);
    };

    const nextLevel = () => {
        if (level >= maxLevel) {
            setStatus('COMPLETED');
            localStorage.removeItem(`kids_game_${gameId}`); // Clear save
            setHasSave(false);
        } else {
            setLevel(l => l + 1);
            saveGame(); // Auto-save on next level
        }
    };

    const deductLife = () => {
        setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) {
                setStatus('GAME_OVER');
                localStorage.removeItem(`kids_game_${gameId}`); // Clear save
                setHasSave(false);
                return 0;
            }
            // Auto-save on life lost
            localStorage.setItem(`kids_game_${gameId}`, JSON.stringify({ level, lives: newLives, score }));
            return newLives;
        });
    };

    const resetToMenu = () => {
        setStatus('MENU');
    };

    return {
        status,
        level,
        lives,
        score,
        maxLives,
        maxLevel,
        hasSave,
        startGame,
        saveGame,
        addScore,
        nextLevel,
        deductLife,
        resetToMenu,
        setStatus
    };
};
