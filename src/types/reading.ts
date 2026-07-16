export type ReadingType = "pages" | "minutes";

export type ReadingSource = "manual" | "reader";

export interface ReadingEntry {
  id: string;

  bookId: number;

  type: ReadingType;

  amount: number;

  date: string;

  source: ReadingSource;
}

export interface DailyReadingGoal {
  enabled: boolean;
  type: ReadingType;
  target: number;
}
