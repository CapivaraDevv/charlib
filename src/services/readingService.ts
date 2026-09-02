import type { ReadingEntry, DailyReadingGoal, WeeklyReadingGoal, MonthlyReadingGoal } from "../types/reading";

const READING_ENTRIES_KEY = "reading_entries";

export function getReadingEntries(): ReadingEntry[]{
    const entries = localStorage.getItem(READING_ENTRIES_KEY);

    if(!entries){
        return [];
    }

    return JSON.parse(entries)
}

export function addReadingEntry(entry: ReadingEntry): void{
    const entries = getReadingEntries()

    entries.push(entry)

    localStorage.setItem(READING_ENTRIES_KEY, JSON.stringify(entries))
}

const DAILY_READING_GOAL_KEY = "daily_reading_goal";

export function setDailyReadingGoal(goal: DailyReadingGoal): void {
    localStorage.setItem(
        DAILY_READING_GOAL_KEY,
        JSON.stringify(goal)
    );
}

export function getDailyReadingGoal(): DailyReadingGoal | null {
    const goal = localStorage.getItem(DAILY_READING_GOAL_KEY);

    if(!goal){
        return null;
    }

    return JSON.parse(goal)
}

const WEEKLY_READING_GOAL_KEY = "weekly_reading_goal";

export function getWeeklyReadingGoal() {
    const data = localStorage.getItem(WEEKLY_READING_GOAL_KEY)

    if(!data) return null;

    return JSON.parse(data)
}

export function setWeeklyReadingGoal(goal: WeeklyReadingGoal): void {
    localStorage.setItem(WEEKLY_READING_GOAL_KEY, JSON.stringify(goal))
}

const MONTHLY_READING_GOAL_KEY = "monthly_reading_goal";

export function getMonthlyReadingGoal() {
    const data = localStorage.getItem(MONTHLY_READING_GOAL_KEY)

    if(!data) return null;

    return JSON.parse(data)
}

export function setMonthlyReadingGoal(goal: MonthlyReadingGoal): void {
    localStorage.setItem(MONTHLY_READING_GOAL_KEY, JSON.stringify(goal))
}

export function recordReadPage(
    bookId: number,
    pageNumber: number,
): void {
    if(
        !Number.isInteger(bookId) ||
        bookId < 1 ||
        !Number.isInteger(pageNumber) ||
        pageNumber < 1
    ) {
        return;
    }

    const entryId = `reader:${bookId}:page:${pageNumber}`;
    const entries = getReadingEntries();

    const alreadyRecorded = entries.some(
        (entry) => entry.id === entryId,
    );

    if (alreadyRecorded) return;

    addReadingEntry({
        id: entryId,
        bookId,
        type: "pages",
        amount: 1,
        date: new Date().toISOString(),
        source: "reader",
    });

}