export function getZonedTime(date: Date, timezone?: string) {
    if (!timezone) return { h: date.getHours(), m: date.getMinutes(), s: date.getSeconds() };
    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hourCycle: 'h23'
        }).formatToParts(date);

        return {
            h: parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10),
            m: parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10),
            s: parseInt(parts.find(p => p.type === 'second')?.value || '0', 10)
        };
    } catch (e) {
        return { h: date.getHours(), m: date.getMinutes(), s: date.getSeconds() };
    }
}

export function getZonedDate(date: Date, timezone?: string) {
    if (!timezone) return date;
    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hourCycle: 'h23'
        }).formatToParts(date);

        const getP = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
        return new Date(getP('year'), getP('month') - 1, getP('day'), getP('hour'), getP('minute'), getP('second'));
    } catch (e) {
        return date;
    }
}
