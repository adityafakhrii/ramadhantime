import { useState, useEffect, useCallback } from 'react';

export interface CustomHabit {
  id: string;
  label: string;
  icon: string;
}

export interface HabitProgress {
  date: string; // YYYY-MM-DD
  completed: Record<string, boolean>; // habit id → done
}

const HABITS_DEF_KEY = 'akyash-custom-habits';
const HABITS_PROGRESS_KEY = 'akyash-habits-progress';

const DEFAULT_HABITS: CustomHabit[] = [
  { id: 'sholat5', label: 'Sholat 5 Waktu', icon: '🕌' },
  { id: 'tilawah', label: 'Tilawah Al-Quran', icon: '📖' },
  { id: 'sedekah', label: 'Sedekah/Infaq', icon: '🤲' },
  { id: 'dzikir', label: 'Dzikir Pagi & Sore', icon: '✨' },
];

const RAMADHAN_EXTRA_HABITS: CustomHabit[] = [
  { id: 'puasa', label: 'Puasa Wajib', icon: '🌙' },
  { id: 'tarawih', label: 'Sholat Tarawih', icon: '🕌' },
];

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateId(): string {
  return `habit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useHabits(isRamadhan: boolean = false) {
  // Load habit definitions
  const [habits, setHabits] = useState<CustomHabit[]>(() => {
    try {
      const stored = localStorage.getItem(HABITS_DEF_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CustomHabit[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse habits definitions from storage", e);
    }
    return [...DEFAULT_HABITS];
  });

  // Load daily progress
  const [progress, setProgress] = useState<HabitProgress>(() => {
    try {
      const stored = localStorage.getItem(HABITS_PROGRESS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as HabitProgress;
        if (parsed.date === getTodayString()) return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse habits progress from storage", e);
    }
    return { date: getTodayString(), completed: {} };
  });

  // Persist habit definitions
  useEffect(() => {
    localStorage.setItem(HABITS_DEF_KEY, JSON.stringify(habits));
  }, [habits]);

  // Persist progress
  useEffect(() => {
    localStorage.setItem(HABITS_PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  // Handle midnight rollover
  useEffect(() => {
    const checkDate = () => {
      const today = getTodayString();
      if (progress.date !== today) {
        setProgress({ date: today, completed: {} });
      }
    };
    const intervalId = setInterval(checkDate, 1000 * 60 * 30); // check every 30min
    return () => clearInterval(intervalId);
  }, [progress.date]);

  // Build the active habits list (user habits + ramadhan extras if enabled)
  const activeHabits: CustomHabit[] = isRamadhan
    ? [...habits, ...RAMADHAN_EXTRA_HABITS.filter(rh => !habits.some(h => h.id === rh.id))]
    : habits.filter(h => !RAMADHAN_EXTRA_HABITS.some(rh => rh.id === h.id));

  const toggleHabit = useCallback((habitId: string) => {
    setProgress(prev => ({
      ...prev,
      completed: {
        ...prev.completed,
        [habitId]: !prev.completed[habitId],
      }
    }));
  }, []);

  const addHabit = useCallback((label: string, icon: string) => {
    const newHabit: CustomHabit = { id: generateId(), label, icon };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const editHabit = useCallback((id: string, label: string, icon: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, label, icon } : h));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setProgress(prev => {
      const { [id]: _, ...rest } = prev.completed;
      return { ...prev, completed: rest };
    });
  }, []);

  const calculateProgress = () => {
    const total = activeHabits.length;
    if (total === 0) return 0;
    const completed = activeHabits.filter(h => progress.completed[h.id]).length;
    return Math.round((completed / total) * 100);
  };

  return {
    habits: activeHabits,
    completedMap: progress.completed,
    toggleHabit,
    addHabit,
    editHabit,
    deleteHabit,
    progress: calculateProgress(),
  };
}
