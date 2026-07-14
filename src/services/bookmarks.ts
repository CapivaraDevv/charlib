import type { BookMark } from "../types/bookmark";

const STORAGE_KEY = "charlib-bookmarks"

export function getBookMarks(bookId: number): BookMark[] {
    const bookmarks: BookMark[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]"
    )

    return bookmarks.filter((bookmark) => bookmark.bookId === bookId)
}

export function saveBookMark(bookmark: BookMark){
    const bookmarks: BookMark[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]"
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...bookmarks, bookmark])
    );
}

export function removeBookMark(id: string){
    const bookmarks: BookMark[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]"
    )

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(bookmarks.filter((bookmark) => bookmark.id !== id))
    )
}