import type { ReadingEntry, DailyReadingGoal } from "../types/reading";

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

export function setWeeklyReadingGoal(goal: DailyReadingGoal): void {
    localStorage.setItem(WEEKLY_READING_GOAL_KEY, JSON.stringify(goal))
}