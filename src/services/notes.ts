import type { Note } from "../types/note";

function getStorageKey(bookId: number) {
    return `book-notes-${bookId}`;
}

export function getNotes(bookId: number): Note[] {
    const notes = localStorage.getItem(getStorageKey(bookId))

    return notes ? JSON.parse(notes) : [];
}

export function saveNote(note: Note) {
    const notes = getNotes(note.bookId)

    notes.push(note)

    localStorage.setItem(getStorageKey(note.bookId), JSON.stringify(notes))
}