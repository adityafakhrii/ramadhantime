import { useState, useCallback } from 'react';

export function useNotifications() {
    const [iftarNotif, setIftarNotif] = useState(() => localStorage.getItem('akyash-notif-iftar') !== 'false');
    const [sahurNotif, setSahurNotif] = useState(() => localStorage.getItem('akyash-notif-sahur') !== 'false');

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
        localStorage.setItem('akyash-notif-iftar', String(enabled));
    };

    const toggleSahur = async (enabled: boolean) => {
        if (enabled) {
            const granted = await requestPermission();
            if (!granted) return;
        }
        setSahurNotif(enabled);
        localStorage.setItem('akyash-notif-sahur', String(enabled));
    };

    return { iftarNotif, sahurNotif, toggleIftar, toggleSahur };
}
