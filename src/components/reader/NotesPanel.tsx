import { X } from "lucide-react";
import NotesList from "./NotesList";
import type { Note } from "../../types/note";
import NoteViewModal from "./NoteViewModal";
import { useState, useMemo } from "react";
import Input from "../common/Input";

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
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-40 flex h-dvh w-full max-w-[380px] flex-col border-l border-white/10 bg-card-background shadow-2xl transition-transform duration-300 ${
          open ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-white/10 p-6">
          <h2 className="font-display text-2xl font-bold">Notas</h2>

          <button
            aria-label="Fechar notas"
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-surface-hover"
          >
            <X size={22} />
          </button>
        </header>

        <div className="border-b border-white/10 p-4">
          <Input
            placeholder="Buscar notas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <NotesList
            notes={filteredNotes}
            currentPage={currentPage}
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
