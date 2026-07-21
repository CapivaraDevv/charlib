import type { Note } from "../../types/note";
import { Pencil, Trash2 } from "lucide-react";

type NotesListProps = {
  notes: Note[];
  currentPage: number;
  isSearching: boolean;
  onView: (note: Note) => void;
  onSelect: (page: number) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
};

export default function NotesList({
  notes,
  currentPage,
  isSearching,
  onView,
  onSelect,
  onEdit,
  onDelete,
}: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="rounded-xl bg-surface p-4 text-center text-text-muted">
        {isSearching ? "Nenhuma nota encontrada." : "Nenhuma nota criada."}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => {
        const isCurrentPage = note.page === currentPage;

        return (
          <div
            key={note.id}
            onClick={() => onView(note)}
            className={`
            rounded-xl
            border
            p-4
            text-left
            transition-all
            duration-200
            cursor-pointer

            ${
              isCurrentPage
                ? "border-primary bg-primary/10"
                : "border-transparent bg-surface hover:bg-surface-hover"
            }
          `}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Página {note.page}</span>

                {isCurrentPage && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                    Atual
                  </span>
                )}
              </div>

              <span className="text-sm text-text-muted">
                {new Date(note.createdAt).toLocaleDateString("pt-BR")}
              </span>

              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(note);
                  }}
                  className="cursor-pointer rounded-lg p-2 hover:bg-surface"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(note);
                  }}
                  className="cursor-pointer rounded-lg p-2 hover:bg-surface"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="line-clamp-3 text-sm text-text-muted">
              {note.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}
