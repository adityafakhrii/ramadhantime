import { useState, useCallback } from 'react';

export function useNotifications() {
    const [iftarNotif, setIftarNotif] = useState(() => localStorage.getItem('ramadhan-notif-iftar') !== 'false');
    const [sahurNotif, setSahurNotif] = useState(() => localStorage.getItem('ramadhan-notif-sahur') !== 'false');

    const requestPermission = async () => {
        if ('Notification' in window) {
            const perm = await Notification.requestPermission();
            return perm === 'granted';
        }
        return false;
    };

    const toggleIftar = async (enabled: boolean) => {
        if (enabled) {
            const granted = await requestPermission();
            if (!granted) return;
        }
        setIftarNotif(enabled);
        localStorage.setItem('ramadhan-notif-iftar', String(enabled));
    };

    const toggleSahur = async (enabled: boolean) => {
        if (enabled) {
            const granted = await requestPermission();
            if (!granted) return;
        }
        setSahurNotif(enabled);
        localStorage.setItem('ramadhan-notif-sahur', String(enabled));
    };

    return { iftarNotif, sahurNotif, toggleIftar, toggleSahur };
}
