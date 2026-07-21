import { X } from "lucide-react";
import NotesList from "./NotesList";
import type { Note } from "../../types/note";
import NoteViewModal from "./NoteViewModal";
import { useState, useMemo } from "react";

type NotesPanelProps = {
  open: boolean;
  notes: Note[];
  currentPage: number;
  onClose: () => void;
  onSelect: (page: number) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
};

export default function NotesPanel({
  open,
  notes,
  currentPage,
  onClose,
  onSelect,
  onEdit,
  onDelete,
}: NotesPanelProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [search, setSearch] = useState("");

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter((note) => {
      return (
        note.content.toLowerCase().includes(query) ||
        note.page.toString().includes(query)
      );
    });
  }, [notes, search]);

  return (
    <>
      <aside
        className={`fixed top-0 right-0 z-40 h-screen w-[380px] border-l border-white/10 bg-surface shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-white/10 p-6">
          <h2 className="font-display text-2xl font-bold">Notas</h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-surface-hover"
          >
            <X size={22} />
          </button>
        </header>

        <div className="border-b border-white/10 p-4">
          <input
            type="text"
            placeholder="Buscar notas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-background px-4 py-2 outline-none focus:border-primary"
          />
        </div>

        <div className="h-[calc(100vh-88px)] overflow-y-auto p-4">
          <NotesList
            notes={filteredNotes}
            currentPage={currentPage}
            isSearching={search.trim().length > 0}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={(note) => setSelectedNote(note)}
          />
        </div>
      </aside>
      <NoteViewModal
        open={selectedNote !== null}
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onGoToPage={(page) => {
          onSelect(page);
          setSelectedNote(null);
          onClose();
        }}
        onEdit={(note) => {
          setSelectedNote(null);
          onEdit(note);
        }}
        onDelete={(note) => {
          setSelectedNote(null);
          onDelete(note);
        }}
      />
    </>
  );
}
