import type { BookMark } from "../types/bookmark";
import { getStoredJson } from "../utils/storage";

const STORAGE_KEY = "charlib-bookmarks"

function getAllBookmarks(): BookMark[] {
  const bookmarks = getStoredJson<unknown>(STORAGE_KEY);

  return Array.isArray(bookmarks) ? (bookmarks as BookMark[]) : [];
}

export function getBookMarks(bookId: number): BookMark[] {
    const bookmarks = getAllBookmarks();

    return bookmarks.filter((bookmark) => bookmark.bookId === bookId)
}

export function saveBookMark(bookmark: BookMark){
    const bookmarks = getAllBookmarks();

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...bookmarks, bookmark])
    );
}

export function removeBookMark(id: string){
    const bookmarks = getAllBookmarks();

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(bookmarks.filter((bookmark) => bookmark.id !== id))
    )
}

export function removeBookMarksForBook(bookId: number): void {
  const bookmarks = getAllBookmarks();

  const remainingBookmarks = bookmarks.filter(
    (bookmark) => bookmark.bookId !== bookId,
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(remainingBookmarks),
  );
}