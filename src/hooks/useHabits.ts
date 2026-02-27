import { useState, useEffect } from 'react';

export type HabitType = 'puasa' | 'tarawih' | 'tahajud' | 'sedekah' | 'tilawah';

export interface DailyHabits {
    date: string; // YYYY-MM-DD
    habits: Record<HabitType, boolean>;
}

const DEFAULT_HABITS: Record<HabitType, boolean> = {
    puasa: false,
    tarawih: false,
    tahajud: false,
    sedekah: false,
    tilawah: false,
};

function getTodayString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const STORAGE_KEY = 'ramadhan-habits';

export function useHabits() {
    const [dailyHabits, setDailyHabits] = useState<DailyHabits>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as DailyHabits;
                // Reset if the stored date is not today
                if (parsed.date !== getTodayString()) {
                    return { date: getTodayString(), habits: { ...DEFAULT_HABITS } };
                }
                return parsed;
            }
        } catch (e) {
            console.warn("Failed to parse habits from storage", e);
        }
        return { date: getTodayString(), habits: { ...DEFAULT_HABITS } };
    });

    // Whenever the state changes, save to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dailyHabits));
    }, [dailyHabits]);

    // Handle midnight rollover if user stays on the app
    useEffect(() => {
        const checkDate = () => {
            const today = getTodayString();
            if (dailyHabits.date !== today) {
                setDailyHabits({ date: today, habits: { ...DEFAULT_HABITS } });
            }
        };
        // Check every hour to be safe
        const intervalId = setInterval(checkDate, 1000 * 60 * 60);
        return () => clearInterval(intervalId);
    }, [dailyHabits.date]);

    const toggleHabit = (habit: HabitType) => {
        setDailyHabits((prev) => ({
            ...prev,
            habits: {
                ...prev.habits,
                [habit]: !prev.habits[habit],
            }
        }));
    };

    const calculateProgress = () => {
        const total = Object.keys(dailyHabits.habits).length;
        const completed = Object.values(dailyHabits.habits).filter(Boolean).length;
        return Math.round((completed / total) * 100);
    };

    return {
        habits: dailyHabits.habits,
        toggleHabit,
        progress: calculateProgress(),
    };
}
