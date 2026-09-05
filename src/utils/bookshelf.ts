import type { Book } from "../types/book";
import { getCurrentPage } from "./bookProgress";

export function getBookProgress(book: Book): number {
  const currentPage = getCurrentPage(book);
  return Math.min(100, Math.round((currentPage / book.pages) * 100));
}

export function getSpineWidth(bookId: number): number {
  const widths = [26, 28, 30, 32, 34, 36];
  return widths[bookId % widths.length];
}

export function getSpineTilt(index: number): number {
  const tilts = [-1.2, -0.6, 0, 0.5, 1, -0.8, 0.7, -0.3];
  return tilts[index % tilts.length];
}

export function splitIntoRows<T>(items: T[], perRow: number): T[][] {
  if (items.length === 0) return [];

  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += perRow) {
    rows.push(items.slice(i, i + perRow));
  }
  return rows;
}

export function getBooksPerRow(width: number): number {
  if (width < 480) return 4;
  if (width < 640) return 5;
  if (width < 768) return 6;
  if (width < 1024) return 8;
  if (width < 1280) return 10;
  return 12;
}
