import type { Book } from "../types/book";

export function getCurrentPage(book: Pick<Book, "id" | "status" | "pages" | "currentPage">): number {
  if (book.status === "completed") return book.pages;
  let saved: string | null = null;
  try { saved = localStorage.getItem(`book-progress-${book.id}`); } catch { /* Use the persisted book when storage is unavailable. */ }
  const page = saved === null ? book.currentPage : Number(saved);
  return Math.max(0, Math.min(book.pages, Number.isFinite(page) ? Math.trunc(page) : book.currentPage));
}
