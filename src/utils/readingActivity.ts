import type { ReadingEntry } from "../types/reading";
import type { readingDay } from "../types/readingDay";


function getLocalDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function getReadingDays(
    entries: ReadingEntry[],
): readingDay[] {
    const totals: Record<string, number> = {};

    for (const entry of entries) {
        if (entry.type !== "pages") {
            continue
        }
        if (!Number.isFinite(entry.amount) || entry.amount <= 0){
            continue
        }
        const date = new Date(entry.date)
        if (Number.isNaN(date.getTime())) {
            continue
        }
        const key = getLocalDateKey(date)

        totals[key] = (totals[key] ?? 0) + entry.amount;
    }
    return Object.entries(totals).map(([date, pages]) => ({ date, pages})).sort((a, b) => a.date.localeCompare(b.date));
}

export function getRecentReadingDays(
    entries: ReadingEntry[],
    totalDays: number = 30,
    referenceDate: Date = new Date(),
): readingDay[] {
    if (!Number.isInteger(totalDays) || totalDays < 1 || Number.isNaN(referenceDate.getTime()) ) {
        return [];
    }

    const readingDay = getReadingDays(entries)
    const totals: Record<string, number> = {};

    for(const day of readingDay) {
        totals[day.date] = day.pages
    }

    const result: readingDay[] = [];

    for(let offset = totalDays - 1; offset >= 0; offset--){
        const date = new Date(
            referenceDate.getFullYear(),
            referenceDate.getMonth(),
            referenceDate.getDate() - offset,
        );

        const key = getLocalDateKey(date)

        result.push({
            date: key,
            pages: totals[key] ?? 0
        });

    }

    return result
}