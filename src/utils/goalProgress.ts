import { getReadingEntries } from "../services/readingService";
import type { ReadingType } from "../types/reading";

export type GoalPeriod = "daily" | "weekly" | "monthly";

function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

function isSameWeek(date: Date, reference: Date): boolean {
  const startOfWeek = new Date(reference);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  startOfWeek.setDate(startOfWeek.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return date >= startOfWeek && date <= endOfWeek;
}

function isSameMonth(date: Date, reference: Date): boolean {
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  );
}

export function getProgressForPeriod(
  period: GoalPeriod,
  type: ReadingType
): number {
  const now = new Date();
  const entries = getReadingEntries();

  return entries
    .filter((entry) => {
      if (entry.type !== type) return false;
      const date = parseDate(entry.date);

      switch (period) {
        case "daily":
          return isSameDay(date, now);
        case "weekly":
          return isSameWeek(date, now);
        case "monthly":
          return isSameMonth(date, now);
        default:
          return false;
      }
    })
    .reduce((sum, entry) => sum + entry.amount, 0);
}

export function getProgressPercent(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}
