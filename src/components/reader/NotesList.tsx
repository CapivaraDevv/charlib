import type { Note } from "../../types/note";
import { Pencil, Trash2 } from "lucide-react";

type NotesListProps = {
  notes: Note[];
  onSelect: (page: number) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
};

export default function NotesList({
  notes,
  onSelect,
  onEdit,
  onDelete,
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
        <div
          key={note.id}
          onClick={() => onSelect(note.page)}
          className="rounded-xl bg-surface p-4 text-left transition-colors hover:bg-surface-hover"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold">Página {note.page}</span>

            <span className="text-sm text-text-muted">
              {new Date(note.createdAt).toLocaleDateString("pt-BR")}
            </span>

            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(note);
                }}
                className="rounded-lg p-2 hover:bg-surface-hover cursor-pointer"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note);
                }}
                className="rounded-lg p-2 hover:bg-red-500/10 cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <p className="line-clamp-3 text-sm text-text-muted">{note.content}</p>
        </div>
      ))}
    </div>
  );
}
