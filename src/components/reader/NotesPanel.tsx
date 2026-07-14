import { X } from "lucide-react";
import NotesList from "./NotesList";
import type { Note } from "../../types/note";

type NotesPanelProps = {
  open: boolean;
  notes: Note[];
  onClose: () => void;
  onSelect: (page: number) => void;
};

export default function NotesPanel({
  open,
  notes,
  onClose,
  onSelect,
}: NotesPanelProps) {
  return (
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

      <div className="h-[calc(100vh-88px)] overflow-y-auto p-4">
        <NotesList
          notes={notes}
          onSelect={onSelect}
        />
      </div>
    </aside>
  );
}