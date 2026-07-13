import type { Note } from "../../types/note";

type NotesListProps = {
  notes: Note[];
  onSelect: (page: number) => void;
};

export default function NotesList({
  notes,
  onSelect,
}: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="rounded-xl bg-surface p-4 text-center text-text-muted">
        Nenhuma nota criada.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <button
          key={note.id}
          onClick={() => onSelect(note.page)}
          className="w-full rounded-xl bg-surface p-4 text-left transition-colors hover:bg-surface-hover"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold">
              Página {note.page}
            </span>

            <span className="text-sm text-text-muted">
              {new Date(note.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <p className="line-clamp-3 text-sm text-text-muted">
            {note.content}
          </p>
        </button>
      ))}
    </div>
  );
}