export function daysSince(formattedDate: string): number {
    const [day, month, year]: number[] = formattedDate.split("/").map((el) => parseInt(el));
    const date: Date = new Date(year, month - 1, day);
    const today: Date = new Date();
    const diff: number = today.valueOf() - date.valueOf();
    const daysPassed: number = Math.floor(diff / (1000 * 60 * 60 * 24));

    return daysPassed;
}