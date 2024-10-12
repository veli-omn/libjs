export function timestampToTime(timestamp: number) {
    const time: Date = new Date(timestamp);

    return {
        day: time.getDate(),
        month: time.getMonth() + 1,
        year: time.getFullYear(),
        hour: time.getHours(),
        minutes: time.getMinutes(),
        seconds: time.getSeconds(),
        miliseconds: time.getMilliseconds()
    };
}