import type { Note } from "../types/note";
import { getStoredJson } from "../utils/storage";

function getStorageKey(bookId: number) {
    return `book-notes-${bookId}`;
}

export function getNotes(bookId: number): Note[] {
  const notes = getStoredJson<unknown>(getStorageKey(bookId));

  return Array.isArray(notes) ? (notes as Note[]) : [];
}

export function saveNote(note: Note) {
    const notes = getNotes(note.bookId)

    notes.push(note)

    localStorage.setItem(getStorageKey(note.bookId), JSON.stringify(notes))
}

export function updateNote(updateNote: Note) {
    const notes = getNotes(updateNote.bookId);

    const updatedNotes = notes.map((note) => note.id === updateNote.id ? {
        ...note,
        content: updateNote.content,
        updatedAt: new Date().toISOString(),
    }
    : note,
    );

    localStorage.setItem(
        getStorageKey(updateNote.bookId),
        JSON.stringify(updatedNotes)
    )
}

export function deleteNote(noteId: string, bookId: number) {
    const notes = getNotes(bookId);

    const updatedNotes = notes.filter(
        (note) => note.id !== noteId,
    );

    localStorage.setItem(
        getStorageKey(bookId),
        JSON.stringify(updatedNotes),
    );
}

export function removeNotesForBook(bookId: number): void {
    localStorage.removeItem(getStorageKey(bookId));
}

